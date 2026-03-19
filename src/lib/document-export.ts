import { SavedStrategy, BusinessCanvasModel, PitchDeck } from "@/types"

<!DOCTYPE html>
<head>
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
    @page {
      m
    body {
      font-size: 11pt;
      color: #1a1a1a;
    h1 {
      fo
      col
    @page {
      size: 8.5in 11in;
      margin: 1in;
     
    body {
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
     
    h1 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 24pt;
      font-weight: bold;
      color: #8A91E3;
      margin-top: 0;
      page-break-inside: a
    .header {
     
      ma
    }
      color: white;
    }
      margin-top: 24p
      border-top: 2pt s
    .footer {
      padding-top: 18pt;
      text-align: center;
     
    .foo
      font-weight: bold;
      margin-bottom: 8
  </style>
<body>
    <h1>TECHPIGEON</h1>
  </div>
  <h1>${strategy.name}</h1>
  <di
      y
      day: 'numeric'
      minute: '2-digit'
    <p><strong>Strategy ID

    <h2>Projec
  </div>
  <div class="sectio
    <p>${strategy.result.marketi

      page-break-inside: avoid;
    }
    .header {
      background: #8A91E3;
      color: white;
      padding: 24pt;
      margin: -1in -1in 24pt -1in;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .implementation-section {
      margin-top: 24pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
    }
    .footer {
      <p>${(strategy.re
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
      text-align: center;
      font-size: 9pt;
      color: #666;
    <
    .footer-brand {
      font-size: 20pt;
      font-weight: bold;
      color: #8A91E3;
      margin-bottom: 8pt;
    <
  </style>
</head>
<body>
  <div class="header">
    <h1>TECHPIGEON</h1>
    <div>Pakistan's Leading AI Platform for Intelligent Marketing Strategies</div>
  </div>

  <h1>${strategy.name}</h1>

  <title>Business Model
      color: #1a1a1a;
    h1 {
      font-size: 24pt
      color: #8A91E3;
    }
      font-family: 'Lor
      font-
      background: #8A91E3;
      ma

      text-align: justi
    .header {
      color: white;
      ma

      color: white;
    }
      margin: 12pt 0;
      bo

    .meta {
      color: #666;
    }
      ma

      font-size: 9pt;
    }
</head>
  <div c


  

      year: 'numeric', 
      day: 'numeric'
  </div>
  <div cla


    <h2>Key Partners</h2>
  </div>
  <div cla


    <h2>Key Resources</h2>
  </div>
  <div cla


    <h2>Customer Relationships
  </div>
  <div cla


    <h2>Cost Structure</h2>
  </div>
  <div cla
    <p>$

    <p><strong>TECHPIG
    <p>© ${new Date().getFullYear()} Techpigeo
</body>
  `
  const blob = new Blob(['\ufeff', htmlContent], { 
  })
  const url = URL.createObjectURL(blob)
  link.h
  docum
  docum
}

    <div class="slide">
      <div class="slide-content
    
  
      </div>
  `).join('')
  const htmlConte
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-c
  <meta charset="UTF-8">
  <xml>
      <w:View>Print</w:View>
    </w:WordDocument>
 

    }
      font-family: 'Int
      line-heig
    }
      
      font-weight: bold;
      margin: 0;
    h2 
      font-size: 16p
      color: white;
      margin: 0 0 12pt 0;
    h3 {
      fo
      mar
    p {
    }
      background: 
     
      marg
    }
      font-size: 16pt;
    }
      margin-bottom: 
    }
      pa
      border-left: 4pt solid #8A91E3;
    .speaker-notes {
      padding: 12pt;
      border-left: 4p
    .executive-summary {
     
      ma
    }
      margin-top: 36pt
      border-top: 2pt so
      color: white;
    }
</head>
  <div class="cover">
    <
      <
    </div>

    <
  </div>
  ${slidesHtml}
  <div class="foote
      padding: 24pt;
      margin: -1in -1in 24pt -1in;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .section {
      margin: 12pt 0;
      padding: 12pt;
      border: 1pt solid #E0E0E0;
      background: #F8F9FA;
      page-break-inside: avoid;
    }

      font-size: 10pt;

      margin-bottom: 18pt;

    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
      text-align: center;

      color: #666;
    }


<body>
  <div class="header">
    <h1>TECHPIGEON</h1>
    <div>AI-Powered Business Intelligence</div>
  </div>

  <h1>Business Model Canvas</h1>
  
  <div class="meta">
    <p><strong>Business Idea:</strong> ${ideaName}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 

    })}</p>



    <h2>Value Proposition</h2>
    <p>${canvas.valueProposition}</p>
  </div>

  <div class="section">

    <p>${canvas.keyPartners}</p>


  <div class="section">
    <h2>Key Activities</h2>
    <p>${canvas.keyActivities}</p>
  </div>

  <div class="section">

    <p>${canvas.keyResources}</p>


  <div class="section">
    <h2>Customer Segments</h2>
    <p>${canvas.customerSegments}</p>
  </div>

  <div class="section">

    <p>${canvas.customerRelationships}</p>


  <div class="section">
    <h2>Channels</h2>
    <p>${canvas.channels}</p>
  </div>

  <div class="section">

    <p>${canvas.costStructure}</p>


  <div class="section">
    <h2>Revenue Streams</h2>
    <p>${canvas.revenueStreams}</p>
  </div>

  <div class="footer">

    <p>G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697</p>
    <p>© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
</body>
</html>


  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 

  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Business_Canvas_${ideaName.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)



  const slidesHtml = pitchDeck.slides.map((slide, index) => `

      <h2 style="background: ${index % 2 === 0 ? '#8A91E3' : '#90CA77'};">Slide ${slide.slideNumber}: ${slide.title}</h2>

        <p>${slide.content.replace(/\n/g, '</p><p>')}</p>

      <div class="speaker-notes">

        <p style="font-style: italic; color: #666;">${slide.notes}</p>
      </div>
    </div>
  `).join('')

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
  <title>Pitch Deck - ${ideaName}</title>

    <w:WordDocument>

      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <style>
    @page {

      margin: 1in;

    body {
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;

      color: #1a1a1a;

    h1 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 28pt;

      color: white;

    }
    h2 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 16pt;
      font-weight: bold;

      padding: 12pt;
      margin: 0 0 12pt 0;
    }

      font-size: 12pt;

      color: #33334D;
      margin: 12pt 0 6pt 0;
    }

      margin: 0 0 10pt 0;

    .cover {
      background: #8A91E3;
      color: white;

      text-align: center;
      margin: -1in -1in 24pt -1in;
      page-break-after: always;

    .cover .subtitle {
      font-size: 16pt;
      margin-top: 12pt;

    .slide {
      margin-bottom: 24pt;


    .slide-content {
      padding: 12pt;
      background: #F8F9FA;
      border-left: 4pt solid #8A91E3;

    .speaker-notes {
      margin-top: 12pt;
      padding: 12pt;
      background: #FFFBF0;
      border-left: 4pt solid #90CA77;
    }
    .executive-summary {
      background: #F0F4FF;
      padding: 18pt;
      border: 2pt solid #8A91E3;
      margin-bottom: 24pt;
      page-break-after: always;
    }
    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;

      font-size: 9pt;

    }

</head>

  <div class="cover">

    <div class="subtitle">INVESTOR PITCH DECK</div>
    <div style="margin-top: 36pt; font-size: 14pt;">
      <strong>TECHPIGEON</strong><br>
      AI-Powered Business Intelligence Platform
    </div>


  <div class="executive-summary">
    <h2 style="background: #8A91E3; margin: -18pt -18pt 12pt -18pt; padding: 12pt;">Executive Summary</h2>
    <p>${pitchDeck.executiveSummary.replace(/\n/g, '</p><p>')}</p>
  </div>

  ${slidesHtml}

  <div class="footer">
    <p><strong>TECHPIGEON</strong></p>
    <p>G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697 | USA: +1(786) 8226386 | Oman: +968 76786324</p>
    <p>© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
</body>
</html>


  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 

  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Pitch_Deck_${ideaName.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

