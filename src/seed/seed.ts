/**
 * Loads the content of the original static page into the CMS: uploads the photography and
 * the hero film to Vercel Blob, then fills both globals.
 *
 *   pnpm seed          does nothing if the globals already have content
 *   pnpm seed force    overwrites both globals with the content below
 *
 * Media is matched by filename, so running it again never uploads a file twice.
 */
import config from '@payload-config'
import path from 'path'
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '../../public')

const force = process.argv.includes('force')
// There is no Next.js cache to clear from a script. A new object per call, because the
// storage plugin keeps the file being uploaded on the context it is given.
const scriptContext = () => ({ disableRevalidate: true })

const payload = await getPayload({ config })

const upload = async (file: string, alt?: string): Promise<number> => {
  const filename = path.basename(file)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0].id

  console.log(`Uploading ${file}`)
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(publicDir, file),
    context: scriptContext(),
  })
  return created.id
}

const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
const alreadySeeded = Boolean(settings.whatsappNumber || home.sizes?.items?.length)

if (alreadySeeded && !force) {
  console.log('Content already exists, nothing to do. Run `pnpm seed force` to overwrite it.')
  process.exit(0)
}

const media = {
  logo: await upload('images/logo-saiboss-enterprise.png', 'Logo Saiboss Enterprise'),
  heroPoster: await upload(
    'images/hero-poster-saiboss.webp',
    'Tong roro Saiboss diletakkan di tapak terbuka berlatarkan pokok pisang',
  ),
  heroVideo: await upload('video/saiboss-roro-service.mp4'),
  banner: await upload(
    'images/banner-rorobin.png',
    'Lori roro Saiboss menurunkan tong roro kuning di pangkalan, dalam pencahayaan senja merah',
  ),
  sizeSmall: await upload('images/tong-kecil-2x6x12.png'),
  sizeMedium: await upload('images/tong-sederhana-4x6x12.png'),
  sizeLarge: await upload('images/tong-besar-5x6x12.png'),
  step1: await upload(
    'images/langkah-1.png',
    'Pelanggan menghantar mesej WhatsApp kepada Saiboss untuk menempah tong roro di tapak binaan',
  ),
  step2: await upload(
    'images/langkah-2.png',
    'Lori roro Saiboss menurunkan tong kosong di tapak pelanggan',
  ),
  step3: await upload(
    'images/langkah-3.png',
    'Tong roro penuh dengan sisa binaan diangkat semula ke lori untuk pelupusan',
  ),
  crew: await upload(
    'images/krew-penghantaran.png',
    'Krew Saiboss bertopi keledar berdiri di hadapan tong roro kuning di pangkalan Dengkil',
  ),
  driver: await upload(
    'images/pemandu-hantar-tong.png',
    'Pemandu Saiboss di dalam kabin lori roro yang membawa tong kuning',
  ),
  skyline: await upload('images/background-kl.jpg'),
  bookingBackground: await upload('images/red-background.jpg'),
}

await payload.updateGlobal({
  slug: 'site-settings',
  context: scriptContext(),
  data: {
    businessName: 'Saiboss Enterprise',
    logo: media.logo,
    whatsappNumber: '601111501005',
    phoneDisplay: '011-1150 1005',
    locality: 'Dengkil',
    region: 'Selangor',
    whatsappGreeting: 'Hi Saiboss!',
    defaultWhatsappMessage: 'Hi Saiboss! Saya nak sewa tong roro. Boleh bagi sebut harga?',
    siteUrl: 'https://tongrorobin.com',
    metaTitle: 'Sewa Tong Roro Dengkil & Lembah Klang dari RM245 | Saiboss Enterprise',
    metaDescription:
      'Sewa tong roro di Dengkil, Cyberjaya, Putrajaya & 25 kawasan Lembah Klang. 3 saiz dari RM245 termasuk hantar & kutip. Tempah 5 minit melalui WhatsApp.',
    ogDescription:
      '3 saiz tong roro dari RM245 termasuk penghantaran & kutipan di 25 kawasan Lembah Klang. Tempahan 5 minit melalui WhatsApp.',
    ogImage: media.heroPoster,
    schemaDescription:
      'Perkhidmatan sewa tong roro untuk sisa binaan, sisa ubah suai, sampah industri dan sampah pukal di Dengkil dan sekitar Lembah Klang. Tiga saiz tong dari RM245 termasuk penghantaran dan kutipan.',
    footerDescription:
      'Perkhidmatan sewa tong roro untuk sisa binaan, sisa ubah suai, sampah industri dan sampah pukal di Dengkil dan sekitar Lembah Klang.',
    footerDescriptionEn:
      'RORO bin rental and bulk waste disposal in Klang Valley, Selangor and Kuala Lumpur, Malaysia.',
  },
})

await payload.updateGlobal({
  slug: 'homepage',
  context: scriptContext(),
  data: {
    hero: {
      tag: 'Dengkil · Seluruh Lembah Klang',
      heading: 'Sewa tong roro\ndi Lembah Klang.',
      sub: 'Kami hantar tong ke lokasi anda, anda isi ikut masa anda, kami angkut semuanya. Harga dari RM245 sudah termasuk penghantaran, kutipan dan pelupusan.',
      primaryCta: {
        label: 'Dapatkan Sebut Harga',
        message: 'Hi Saiboss! Saya nak sewa tong roro. Boleh bagi sebut harga?',
      },
      secondaryCtaLabel: 'Lihat Saiz & Harga',
      poster: media.heroPoster,
      video: media.heroVideo,
    },
    figures: [
      { prefix: 'RM', value: 245, caption: 'Harga bermula, termasuk hantar dan kutip' },
      { value: 3, suffix: 'saiz', caption: 'Dari ±4 hingga ±10 meter padu' },
      { value: 25, suffix: 'kawasan', caption: 'Sekitar Lembah Klang' },
      { value: 7, suffix: 'hari', caption: 'Tempoh sewaan maksimum' },
    ],
    work: {
      eyebrow: 'Kegunaan',
      heading: 'Kalau sisa anda perlu diangkut, kami uruskan.',
      lede: 'Tak perlu upah lori berulang kali atau berulang-alik ke pusat pelupusan. Satu tong di lokasi anda, dan kami angkut semuanya sekali gus.',
      items: [
        {
          title: 'Ubah suai rumah',
          description: 'Runtuhan simen, jubin lama, kayu, plaster siling dan pintu tingkap.',
        },
        {
          title: 'Tapak binaan & perobohan',
          description: 'Konkrit, batu-bata dan sisa kerja tanah, ikut jadual projek anda.',
        },
        {
          title: 'Kilang, gudang & industri',
          description: 'Sisa pengeluaran, palet dan pembungkusan pukal dengan kutipan berjadual.',
        },
        {
          title: 'Kedai & premis komersial',
          description: 'Sisa fit-out ruang niaga, pejabat, hotel dan restoran.',
        },
        {
          title: 'Landskap & tebangan pokok',
          description: 'Dahan, batang pokok dan sisa kebun selepas kerja pembersihan.',
        },
        {
          title: 'Mengosongkan rumah & stor',
          description: 'Perabot, tilam dan barangan pukal sebelum pindah atau menyewa.',
        },
      ],
      note: 'Kami tak terima bahan kimia, bahan mudah terbakar atau sisa berbahaya. Tak pasti dengan sisa anda? [Tanya dulu di WhatsApp](wa:Hi Saiboss! Boleh saya semak sama ada sisa saya diterima?).',
    },
    moment: {
      label: 'Penghantaran',
      text: 'Tong sampai, diturunkan, dan kami berundur. Anda tak perlu angkat apa-apa.',
      image: media.banner,
    },
    sizes: {
      eyebrow: 'Saiz & harga',
      heading: 'Tiga saiz. Harga terus terang.',
      lede: 'Pilih saiz yang padan dengan sisa anda. Setiap harga sudah termasuk penghantaran, kutipan dan pelupusan sisa dalam kawasan liputan, untuk sewaan sehingga 7 hari.',
      items: [
        {
          name: 'Tong Kecil',
          shortName: 'Kecil',
          price: 245,
          heightFt: 2,
          widthFt: 6,
          lengthFt: 12,
          capacityM3: 4,
          hint: 'Ubah suai kecil, perabot lama, sisa taman',
          uses: [
            { text: 'Ubah suai kecil seperti bilik air atau dapur' },
            { text: 'Buang perabot dan barangan lama' },
            { text: 'Sisa taman dan kebun' },
          ],
          image: media.sizeSmall,
        },
        {
          name: 'Tong Sederhana',
          shortName: 'Sederhana',
          price: 350,
          heightFt: 4,
          widthFt: 6,
          lengthFt: 12,
          capacityM3: 8,
          hint: 'Ubah suai penuh rumah atau kedai',
          uses: [
            { text: 'Ubah suai penuh rumah atau kedai' },
            { text: 'Sisa kontraktor renovasi' },
            { text: 'Mengosongkan rumah sepenuhnya' },
          ],
          image: media.sizeMedium,
          isDefault: true,
        },
        {
          name: 'Tong Besar',
          shortName: 'Besar',
          price: 480,
          heightFt: 5,
          widthFt: 6,
          lengthFt: 12,
          capacityM3: 10,
          hint: 'Tapak binaan, perobohan, sisa industri',
          uses: [
            { text: 'Tapak binaan dan perobohan' },
            { text: 'Sisa kilang, gudang dan industri' },
            { text: 'Projek pembersihan berskala besar' },
          ],
          image: media.sizeLarge,
        },
      ],
      priceNote: 'Termasuk penghantaran, kutipan dan pelupusan sisa',
      maxRentalDays: 7,
      help: {
        title: 'Tak pasti saiz mana yang sesuai?',
        text: 'Hantar gambar sisa atau tapak anda di WhatsApp. Kami cadangkan saiz yang betul supaya anda tak bayar lebih daripada yang perlu.',
        cta: {
          label: 'Tanya Saiz yang Sesuai',
          message:
            'Hi Saiboss! Boleh bantu saya pilih saiz tong roro? Saya akan hantar gambar sisa saya.',
        },
      },
    },
    process: {
      eyebrow: 'Cara kerja',
      heading: 'Satu perbualan WhatsApp,\ntiga langkah.',
      steps: [
        {
          title: 'Beritahu keperluan anda',
          text: 'Pilih saiz tong, kawasan dan tempoh sewaan melalui borang di atas atau terus di WhatsApp. Kami balas dengan harga muktamad dan tarikh kosong.',
          image: media.step1,
        },
        {
          title: 'Kami hantar tong',
          text: 'Tong sampai di lokasi anda pada tarikh yang dijanjikan. Anda cuma perlukan ruang rata sepanjang lebih kurang 12 kaki dan laluan untuk lori masuk.',
          image: media.step2,
        },
        {
          title: 'Isi, kami angkut',
          text: 'Isi tong ikut masa anda. Bila dah siap, kami kutip tong bersama semua sisa dan bawa terus ke pelupusan.',
          image: media.step3,
        },
      ],
    },
    why: {
      eyebrow: 'Kenapa Saiboss',
      heading: 'Lori kami. Pemandu kami. Tanggungjawab kami.',
      lede: 'Kami uruskan sendiri setiap penghantaran dan kutipan dari pangkalan kami di Dengkil. Sebab itu urusan cepat, dan harga tak berselindung.',
      reasons: [
        {
          title: 'Harga termasuk semua',
          text: 'Penghantaran, kutipan dan pelupusan sisa dah dikira dalam harga. Anda sahkan harga muktamad sebelum tong dihantar.',
        },
        {
          title: 'Pangkalan di Dengkil',
          text: 'Kedudukan tengah untuk Cyberjaya, Putrajaya, Bangi, KLIA dan koridor selatan Lembah Klang, jadi laluan penghantaran pendek.',
        },
        {
          title: 'Tiga saiz, harga jelas',
          text: 'Kecil, sederhana atau besar: anda bayar untuk saiz yang anda perlukan sahaja. Tak pasti? Hantar gambar sisa, kami cadangkan yang betul.',
        },
      ],
      crew: [
        { image: media.crew, caption: 'Krew yang menguruskan penghantaran anda' },
        { image: media.driver, caption: 'Setiap tong dihantar oleh pemandu kami sendiri' },
      ],
      credsLabel: 'Pernah membekal untuk',
      creds: [
        { name: 'Terminal 2 KLIA', type: 'Lapangan terbang' },
        { name: 'UPM Bangi', type: 'Kampus universiti' },
        { name: 'Tenpower Banting', type: 'Tapak industri' },
        { name: 'SK Rinching Hilir', type: 'Sekolah rendah' },
      ],
    },
    coverage: {
      eyebrow: 'Kawasan liputan',
      heading: '25 kawasan, satu pangkalan.',
      lede: 'Kami beroperasi dari Dengkil dan menghantar terus ke lokasi anda.',
      baseName: 'Dengkil',
      baseTag: 'Pangkalan kami',
      areas: [
        'Cyberjaya',
        'Putrajaya',
        'KLIA',
        'Sepang',
        'Bandar Baru Salak Tinggi',
        'Nilai',
        'Bangi',
        'Kajang',
        'Semenyih',
        'Hulu Langat',
        'Seri Kembangan',
        'Serdang',
        'Puchong',
        'Kuala Lumpur',
        'Petaling Jaya',
        'Subang',
        'USJ',
        'Shah Alam',
        'Klang',
        'Kuala Langat',
        'Banting',
        'Sungai Buloh',
        'Rawang',
        'Seremban',
      ].map((name) => ({ name })),
      note: 'Kawasan anda tiada dalam senarai? [WhatsApp kami](wa:Hi Saiboss! Kawasan saya tiada dalam senarai. Boleh semak sama ada anda boleh hantar?) dan kemungkinan besar kami masih boleh bantu.',
      background: media.skyline,
    },
    faq: {
      eyebrow: 'Soalan lazim',
      heading: 'Sebelum anda tempah.',
      items: [
        {
          question: 'Berapa harga sewa tong roro?',
          answer:
            'Harga bermula RM245 untuk tong kecil, RM350 untuk tong sederhana dan RM480 untuk tong besar. Semuanya sudah termasuk penghantaran, kutipan dan pelupusan sisa dalam kawasan liputan kami. Harga muktamad kami sahkan di WhatsApp ikut kawasan anda, sebelum tong dihantar.',
        },
        {
          question: 'Berapa besar tong roro Saiboss?',
          answer:
            'Tiga saiz, semuanya 12 kaki panjang dan 6 kaki lebar: tong kecil 2 kaki tinggi (±4 meter padu), tong sederhana 4 kaki tinggi (±8 meter padu) dan tong besar 5 kaki tinggi (±10 meter padu). Tak pasti saiz mana yang sesuai? [Hantar gambar sisa anda](wa:Hi Saiboss! Boleh bantu saya pilih saiz tong roro? Saya akan hantar gambar sisa saya.) dan kami cadangkan yang betul.',
        },
        {
          question: 'Apa jenis sisa yang boleh dibuang?',
          answer:
            'Sisa binaan dan perobohan, sisa ubah suai, sampah industri dan komersial, sampah domestik, perabot lama, sisa besar isi rumah, serta pokok dan sisa taman. Bahan kimia, bahan mudah terbakar dan sisa berbahaya tidak diterima.',
        },
        {
          question: 'Berapa lama tempoh sewaan?',
          answer:
            'Dari 1 hingga 7 hari. Pilih bilangan hari semasa tempahan, dan kami kutip tong pada tarikh itu. Perlukan lebih lama? Bagitahu kami awal-awal di WhatsApp.',
        },
        {
          question: 'Betul ke harga dah termasuk penghantaran dan kutipan?',
          answer:
            'Betul. Harga sewaan dah termasuk penghantaran tong ke lokasi anda dan kutipan semula bersama sisa, dalam kawasan liputan kami. Tiada caj tersembunyi.',
        },
        {
          question: 'Apa yang perlu disediakan di lokasi saya?',
          answer:
            'Ruang rata sepanjang lebih kurang 12 kaki untuk tong, dan laluan yang boleh dimasuki lori roro. Tak pasti lokasi anda sesuai atau tidak? Hantar gambar kawasan tu di WhatsApp, kami sahkan untuk anda.',
        },
        {
          question: 'Macam mana nak tempah?',
          answer:
            'Pilih saiz tong, kawasan dan bilangan hari dalam borang di bawah, kemudian tekan Tempah. Butiran anda terus masuk ke WhatsApp kami, dan kami sahkan harga muktamad serta tarikh penghantaran. Semuanya selesai dalam 5 minit.',
        },
      ],
    },
    booking: {
      eyebrow: 'Tempahan',
      heading: 'Sedia nak buang sisa anda?',
      points: [
        { text: 'Harga termasuk penghantaran, kutipan dan pelupusan' },
        { text: 'Tempoh sewaan fleksibel dari 1 hingga 7 hari' },
        { text: 'Tiada pendaftaran akaun, tiada borang panjang' },
      ],
      callText: 'Lebih suka bercakap terus? Hubungi',
      formTitle: 'Tempah tong roro anda',
      formSub: 'Butiran anda terus masuk ke WhatsApp kami.',
      formFine: 'Tiada spam. Butiran anda hanya digunakan untuk tempahan ini.',
      wasteTypes: [
        { label: 'Sisa binaan / ubah suai' },
        { label: 'Perabot & sampah pukal' },
        { label: 'Sisa taman / pokok' },
        { label: 'Sisa kilang / komersial' },
        { label: 'Campuran / lain-lain' },
      ],
      background: media.bookingBackground,
    },
  },
})

console.log('Seed complete.')
process.exit(0)
