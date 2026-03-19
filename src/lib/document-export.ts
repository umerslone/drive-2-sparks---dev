import { SavedStrategy, BusinessCanvasModel, PitchDeck } from "@/types"

export async function exportStrategyAsWord(strategy: SavedStrategy) {
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
  <title>${strategy.name}</title>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
    }
    body {
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
    }
    h1 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 24pt;
      font-weight: bold;
      color: #8A91E3;
      margin-top: 0;
      margin-bottom: 12pt;
      page-break-after: avoid;
    }
    h2 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 16pt;
      font-weight: bold;
      color: #33334D;
      margin-top: 18pt;
      margin-bottom: 10pt;
      border-bottom: 2pt solid #8A91E3;
      page-break-after: avoid;
    }
    h3 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 14pt;
      font-weight: bold;
      color: #33334D;
      margin-top: 14pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 10pt;
      text-align: justify;
    }
    .section {
      margin: 18pt 0;
      padding: 12pt;
      border-left: 4pt solid #8A91E3;
      background: #F8F9FA;
      page-break-inside: avoid;
    }
    .meta {
      font-size: 10pt;
      color: #666;
      margin-bottom: 18pt;
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
    .header .tagline {
      font-size: 12pt;
      margin-top: 8pt;
    }
    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
      text-align: center;
      font-size: 9pt;
      color: #666;
      page-break-inside: avoid;
    }
    .footer-brand {
      font-weight: bold;
      color: #8A91E3;
      font-size: 11pt;
      margin-bottom: 6pt;
    }
    .implementation-section {
      margin-top: 24pt;
      page-break-before: always;
    }
    ul, ol {
      margin: 8pt 0;
      padding-left: 24pt;
    }
    li {
      margin-bottom: 6pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TECHPIGEON</h1>
    <div class="tagline">AI-Powered Marketing & Business Intelligence</div>
  </div>

  <h1>${strategy.name}</h1>
  
  <div class="meta">
    <p><strong>Generated:</strong> ${new Date(strategy.timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
    <p><strong>Strategy ID:</strong> ${strategy.id}</p>
  </div>

  <div class="section">
    <h2>Project Description</h2>
    <p>${strategy.description}</p>
  </div>

  <div class="section">
    <h2>Marketing Copy</h2>
    <p>${strategy.result.marketingCopy.replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="section">
    <h2>Visual Strategy</h2>
    <p>${strategy.result.visualStrategy.replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="section">
    <h2>Target Audience</h2>
    <p>${strategy.result.targetAudience.replace(/\n/g, '</p><p>')}</p>
  </div>

  <div class="implementation-section">
    <h2>Implementation Workflows</h2>

    <div class="section">
      <h3>Application Workflow</h3>
      <p>${(strategy.result.applicationWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h3>UI Workflow</h3>
      <p>${(strategy.result.uiWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h3>Database Workflow</h3>
      <p>${(strategy.result.databaseWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h3>Mobile Workflow</h3>
      <p>${(strategy.result.mobileWorkflow || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>

    <div class="section">
      <h3>Implementation Checklist</h3>
      <p>${(strategy.result.implementationChecklist || 'Not available').replace(/\n/g, '</p><p>')}</p>
    </div>
  </div>

  <div class="footer">
    <div class="footer-brand">TECHPIGEON</div>
    <p>Pakistan's Leading AI Platform for Intelligent Marketing Strategies and Business Insights</p>
    <p><strong>Pakistan Office:</strong> G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697</p>
    <p><strong>USA Office:</strong> Ph: +1(786) 8226386</p>
    <p><strong>Oman Office:</strong> Techpigeon Spark LLC, Dohat al adab st, Alkhuwair, 133, Muscat, Oman 🇴🇲 • Ph: +968 76786324</p>
    <p style="margin-top: 12pt; font-size: 8pt;">© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
</body>
</html>
  `

  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${strategy.name.replace(/[^a-z0-9]/gi, '_')}_Techpigeon_Strategy.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportCanvasAsWord(canvas: BusinessCanvasModel, ideaName: string) {
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
  <title>Business Model Canvas - ${ideaName}</title>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
    body {
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
    }
    h1 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 24pt;
      font-weight: bold;
      color: #8A91E3;
      margin: 0 0 12pt 0;
    }
    h2 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 14pt;
      font-weight: bold;
      color: white;
      background: #8A91E3;
      padding: 8pt;
      margin: 18pt 0 10pt 0;
    }
    p {
      margin: 0 0 10pt 0;
      text-align: justify;
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
    .section {
      margin: 12pt 0;
      padding: 12pt;
      border: 1pt solid #E0E0E0;
      background: #F8F9FA;
      page-break-inside: avoid;
    }
    .meta {
      font-size: 10pt;
      color: #666;
      margin-bottom: 18pt;
    }
    .footer {
      margin-top: 36pt;
      padding-top: 18pt;
      border-top: 2pt solid #8A91E3;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
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
      day: 'numeric' 
    })}</p>
  </div>

  <div class="section">
    <h2>Value Proposition</h2>
    <p>${canvas.valueProposition}</p>
  </div>

  <div class="section">
    <h2>Key Partners</h2>
    <p>${canvas.keyPartners}</p>
  </div>

  <div class="section">
    <h2>Key Activities</h2>
    <p>${canvas.keyActivities}</p>
  </div>

  <div class="section">
    <h2>Key Resources</h2>
    <p>${canvas.keyResources}</p>
  </div>

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
    <h2>Revenue Streams</h2>
    <p>${canvas.revenueStreams}</p>
  </div>

  <div class="footer">
    <p><strong>TECHPIGEON</strong></p>
    <p>G-7/4, Islamabad 44000, Pakistan • Ph: +92(300) 0529697</p>
    <p>© ${new Date().getFullYear()} Techpigeon. All rights reserved. | www.techpigeon.org</p>
  </div>
</body>
</html>
  `

  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Business_Canvas_${ideaName.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportPitchDeckAsWord(pitchDeck: PitchDeck, ideaName: string) {
  const slidesHtml = pitchDeck.slides.map((slide, index) => `
    <div class="slide" style="page-break-before: ${index > 0 ? 'always' : 'auto'};">
      <h2 style="background: ${index % 2 === 0 ? '#8A91E3' : '#90CA77'};">Slide ${slide.slideNumber}: ${slide.title}</h2>
      <div class="slide-content">
        <p>${slide.content.replace(/\n/g, '</p><p>')}</p>
      </div>
      <div class="speaker-notes">
        <h3>Speaker Notes:</h3>
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
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
    body {
      font-family: 'Inter', 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
    }
    h1 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 28pt;
      font-weight: bold;
      color: white;
      margin: 0;
    }
    h2 {
      font-family: 'Lora', 'Cambria', serif;
      font-size: 16pt;
      font-weight: bold;
      color: white;
      padding: 12pt;
      margin: 0 0 12pt 0;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      color: #33334D;
      margin: 12pt 0 6pt 0;
    }
    p {
      margin: 0 0 10pt 0;
    }
    .cover {
      background: #8A91E3;
      color: white;
      padding: 48pt;
      text-align: center;
      margin: -1in -1in 24pt -1in;
      page-break-after: always;
    }
    .cover .subtitle {
      font-size: 16pt;
      margin-top: 12pt;
    }
    .slide {
      margin-bottom: 24pt;
    }
    .slide-content {
      padding: 12pt;
      background: #F8F9FA;
      border-left: 4pt solid #8A91E3;
    }
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
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${ideaName}</h1>
    <div class="subtitle">INVESTOR PITCH DECK</div>
    <div style="margin-top: 36pt; font-size: 14pt;">
      <strong>TECHPIGEON</strong><br>
      AI-Powered Business Intelligence Platform
    </div>
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
  `

  const blob = new Blob(['\ufeff', htmlContent], { 
    type: 'application/msword' 
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Pitch_Deck_${ideaName.replace(/[^a-z0-9]/gi, '_')}_Techpigeon.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
