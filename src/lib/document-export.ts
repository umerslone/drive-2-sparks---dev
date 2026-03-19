import { SavedStrategy, BusinessCanvasModel, PitchDeck } from "@/types"

<!DOCTYPE html>
<head>
  <title>${stra
    <w:WordDocument>
      
  </xml>
  <title>${strategy.name}</title>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <style>
      page-
    h2 {
      font-weight:
     
    }
      background: #8A91E3;
      padding: 24pt;
      text-align: cente
    .header h1 {
     
    .sec
      padding: 12pt;
      background: #F8F
    }
      font-size: 10pt
      margin-bottom:
    .implementation-section {
     
    }
      margin-top: 36pt
      border-top: 2pt so
      font-size: 9pt;
    }
      font-size: 20pt;
     
    }
</head>
  <div class="heade
    <div>Pakistan's 


    <
      year: 'num
      day: 'numeric
    <p><strong>T
     
  </div>
  <div class="section
    <p>${strategy.de

    <h2>Marketing Copy</h2
  </div>
  <di
    <p>${(s

    <h2>Target Aud
  </div>
  <di
    .implementation-section {
      margin-top: 24pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
    }
    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    .footer-brand {
      font-size: 20pt;
      font-weight: bold;
      color: #8A91E3;
      margin-bottom: 8pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TECHPIGEON</h1>
    <div>Pakistan's Leading AI Platform for Intelligent Marketing Strategies</div>
  </div>

  <h1>${strategy.name}</h1>

  <div class="meta">
    <p><strong>Strategy ID:</strong> ${strategy.id}</p>
    <p><strong>Generated:</strong> ${new Date(strategy.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })}</p>
    <p><strong>Time:</strong> ${new Date(strategy.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    })}</p>
  </div>

  <div class="section">
    <h2>Project Description</h2>
    <p>${strategy.description}</p>
  </div>

  <div class="section">
    <h2>Marketing Copy</h2>
    <p>${(strategy.result.marketingCopy || '').replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="section">
    <h2>Visual Strategy</h2>
    <p>${(strategy.result.visualStrategy || '').replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="section">
    <h2>Target Audience</h2>
    <p>${(strategy.result.targetAudience || '').replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="implementation-section">
    <h1>Implementation Workflows</h1>

    <div class="section">
      <h2>Application Workflow</h2>
      <p>${(strategy.result.applicationWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
      font

    }
      <h2>UI Workflow</h2>
      <p>${(strategy.result.uiWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
      page

      font-size: 16pt;
      <h2>Database Workflow</h2>
      <p>${(strategy.result.databaseWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h2>Mobile Workflow</h2>
      <p>${(strategy.result.mobileWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h2>Implementation Checklist</h2>
      <p>${(strategy.result.implementationChecklist || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>
  </div>

  <div class="footer">
    <div class="footer-brand">TECHPIGEON</div>
    <p>G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697 | USA: +1(786) 8226386 | Oman: +968 76786324</p>
    <p>© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
    .fo
</html>
   

  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 
    
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Strategy_${strategy.name.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
 

export function exportBusinessCanvasAsWord(canvas: BusinessCanvasModel, ideaName: string) {
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <div
  <meta charset="UTF-8">
  <title>Business Model Canvas - ${ideaName}</title>
  <xml>
    <h2>Key Partners
      <w:View>Print</w:View>

    </w:WordDocument>
    <p>$
  <style>
  <div clas
      size: 8.5in 11in;
  </div>
    }
    <h2>Cu
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
    <p>${canvas.custo
    }
  <div c
      font-family: 'Lora', 'Cambria', serif;
  </div>
      font-weight: bold;
      color: #8A91E3;
      margin-top: 0;
      page-break-inside: avoid;
    }
    h2 {
      font-size: 16pt;
      font-weight: bold;
      color: #33334D;
    <p>© ${new Date().g
      margin-bottom: 8pt;
</htm
    .header {
      background: #8A91E3;
      color: white;
      padding: 24pt;
      margin: -1in -1in 24pt -1in;
      text-align: center;
    }
  link.click()
      color: white;
}
     
    .section {
      margin: 12pt 0;
      padding: 12pt;
      border: 1pt solid #E0E0E0;
      background: #F8F9FA;
      page-break-inside: avoid;
    }
    .meta {

      color: #666;
      margin-bottom: 18pt;
    }
    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
  </xml>
      font-size: 9pt;
      size: 8.5in 
    }
    .footer-brand {
      font-size: 20pt;
      font-weight: bold;
      color: #8A91E3;
    h1 {
    }
      font
</head>
<body>
  <div class="header">
      font-size: 16pt;
    <div>AI-Powered Business Intelligence</div>
      pa

    h3 {
  
  <div class="meta">
    <p><strong>Business Idea:</strong> ${ideaName}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
    .cover {
      day: 'numeric'
      paddi
  </div>

      margin-top: 12pt;
    <h2>Value Proposition</h2>
    <p>${canvas.valueProposition}</p>
  </div>

  <div class="section">
    <h2>Key Partners</h2>
      background: #F8F9FA;
  </div>

      border-left: 4pt 
    <h2>Key Activities</h2>
    <p>${canvas.keyActivities}</p>
  </div>

      margin-top: 36pt;
    <h2>Key Resources</h2>
    <p>${canvas.keyResources}</p>
    .foo

  <div class="section">
    <h2>Customer Segments</h2>
    <p>${canvas.customerSegments}</p>
  </div>

  <div class="section">
    <h2>Customer Relationships</h2>
    <p>${canvas.customerRelationships}</p>
  </div>

  <div class="section">
    <h2>Channels</h2>
    <p>${canvas.channels}</p>
  </div>

  <div class="section">
    <h2>Cost Structure</h2>
    <p>${canvas.costStructure}</p>
  </div>

  <div class="section">
    <p>G-7/4, Islamabad 4400
    <p>${canvas.revenueStreams}</p>
</body>

  <div class="footer">
    <div class="footer-brand">TECHPIGEON</div>
    <p>G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697</p>
    <p>© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
</body>
</html>
  `

  const blob = new Blob(['\ufeff', htmlContent], { 

  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Business_Canvas_${ideaName.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)

  document.body.removeChild(link)

}

export function exportPitchDeckAsWord(pitchDeck: PitchDeck, ideaName: string) {

    <div class="slide">
      <h2 style="background: ${index % 2 === 0 ? '#8A91E3' : '#90CA77'}; color: white; padding: 12pt;">Slide ${slide.slideNumber}: ${slide.title}</h2>
      <div class="slide-content">
        <p>${slide.content.replace(/\n/g, '</p><p>')}</p>
      </div>

        <h3>Speaker Notes:</h3>
        <p style="font-style: italic; color: #666;">${slide.notes}</p>
      </div>
    </div>
  `).join('')

  const htmlContent = `

<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>

  <meta charset="UTF-8">
  <title>Pitch Deck - ${ideaName}</title>
  <xml>

      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>

  <style>

      size: 8.5in 11in;
      margin: 1in;
    }

      font-family: 'Inter', 'Calibri', sans-serif;

      line-height: 1.5;

    }

      font-family: 'Lora', 'Cambria', serif;
      font-size: 28pt;
      font-weight: bold;
      color: white;
      margin: 0;

    h2 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 16pt;
      font-weight: bold;
      color: white;
      padding: 12pt;
      margin: 0 0 12pt 0;

    h3 {

      font-weight: bold;

      margin: 12pt 0 6pt 0;

    p {
      margin: 0 0 10pt 0;
    }
    .cover {
      background: #8A91E3;
      color: white;
      padding: 72pt;

      margin: -1in -1in 24pt -1in;
      page-break-after: always;
    }

      font-size: 16pt;
      margin-top: 12pt;
    }

      margin-bottom: 24pt;

    }









































































