import { generateQR } from './util'
import { PDFDocument, range, StandardFonts } from 'pdf-lib'
import moment from 'moment'
const ys = {
  travail: 578,
  achats: 533,
  sante: 477,
  famille: 435,
  handicap: 396,
  sport_animaux: 358,
  convocation: 295,
  missions: 255,
  enfants: 211,
}

export async function generatePdf(profile, reasons, pdfBase) {
  const creationInstant = new Date()
  const creationDate = creationInstant.toLocaleDateString('fr-FR')
  const creationHour = creationInstant
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    birthday,
    placeofbirth,
    address,
    zipcode,
    city,
    datesortie,
    heuresortie,
    duree,
  } = profile
  const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
  pdfDoc.setSubject('Attestation de déplacement dérogatoire')
  pdfDoc.setKeywords([
    'covid19',
    'covid-19',
    'attestation',
    'déclaration',
    'déplacement',
    'officielle',
    'gouvernement',
  ])
  pdfDoc.setProducer('DNUM/SDIT')
  pdfDoc.setCreator('')
  pdfDoc.setAuthor("Ministère de l'intérieur")


  // Add the first copied page
  for (var i = 0; i < duree; i++) {
    const nextdate = moment(datesortie + " " + heuresortie, 'DD/MM/YYYY HH:mm').add(i, 'hours');
    const nextheuresortie = nextdate.format('HH:mm');
    const nextdatesortie = nextdate.format('DD/MM/YYYY');
    const data = [
      `Cree le: ${creationDate} a ${creationHour}`,
      `Nom: ${lastname}`,
      `Prenom: ${firstname}`,
      `Naissance: ${birthday} a ${placeofbirth}`,
      `Adresse: ${address} ${zipcode} ${city}`,
      `Sortie: ${nextdatesortie} a ${nextheuresortie}`,
      `Motifs: ${reasons}`,
    ].join(';\n ')
    if (i > 0) {
      const pdfDocTemplate = await PDFDocument.load(existingPdfBytes)
      const [blankDoc] = await pdfDoc.copyPages(pdfDocTemplate, [0])
      pdfDoc.addPage(blankDoc)
    }
    const page1 = pdfDoc.getPages()[i]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const drawText = (text, x, y, size = 11) => {
      page1.drawText(text, { x, y, size, font })
    }

    drawText(`${firstname} ${lastname}`, 119, 696)
    drawText(birthday, 119, 674)
    drawText(placeofbirth, 297, 674)
    drawText(`${address} ${zipcode} ${city}`, 133, 652)

    reasons
      .split(', ')
      .forEach(reason => {
        drawText('x', 78, ys[reason] - 2, 18)
      })

    let locationSize = getIdealFontSize(font, profile.city, 83, 7, 11)

    if (!locationSize) {
      alert(
        'Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.',
      )
      locationSize = 7
    }

    drawText(profile.city, 105, 177, locationSize)
    drawText(`${nextdatesortie}`, 91, 153, 11)
    drawText(`${nextheuresortie}`, 264, 153, 11)

    // const shortCreationDate = `${creationDate.split('/')[0]}/${
    //   creationDate.split('/')[1]
    // }`
    // drawText(shortCreationDate, 314, 189, locationSize)

    // // Date création
    // drawText('Date de création:', 479, 130, 6)
    // drawText(`${creationDate} à ${creationHour}`, 470, 124, 6)

    const generatedQR = await generateQR(data)

    const qrImage = await pdfDoc.embedPng(generatedQR)

    page1.drawImage(qrImage, {
      x: page1.getWidth() - 156,
      y: 100,
      width: 92,
      height: 92,
    })

    // pdfDoc.addPage()
    // const page2 = pdfDoc.getPages()[2 * i + 1]
    // page2.drawImage(qrImage, {
    //   x: 50,
    //   y: page2.getHeight() - 350,
    //   width: 300,
    //   height: 300,
    // })

  }


  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], { type: 'application/pdf' })
}

function getIdealFontSize(font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}
