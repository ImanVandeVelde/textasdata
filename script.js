// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
    MaryArray.forEach ((element) => {
      element.style.color = 'black';
    });

    PercyArray.forEach ((element) => {
      element.style.color = 'black';
    }); 

    } else if (event.target.value == 'Mary') {
      MaryArray.forEach((element) => {
        element.style.color = 'blue';
      });
      PercyArray.forEach((element) => {
        element.style.color = 'black';
      });
    } else {
      PercyArray.forEach((element) => {
        element.style.color = 'yellow';
      });
      MaryArray.forEach((element) => {
        element.style.color = 'black';
      });
    }
  }

// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions() {
  const deletions = document.querySelectorAll('del');
  deletions.forEach(del => {
    del.style.display = del.style.display === 'inline' ? 'none' : 'inline';
  });
}

// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)

let showReadingText = false;

  function toggleReading() {
    
    var margin = document.getElementsByClassName('marginAdd');
    var marginArray = Array.from(margin)

    var supra = document.getElementsByClassName('supraAdd');
    var supraArray = Array.from(supra);

    var over = document.getElementsByClassName('overwritten');
    var overArray = Array.from(over);


    if (showReadingText) {
      supraArray.forEach((element) => {
        element.style.removeProperty('vertical-align');
      });

      marginArray.forEach((element) => {
        element.style.removeProperty('position');
        element.style.removeProperty('left');
        element.style.removeProperty('display')
      });

      overArray.forEach((element) => {
        element.style.removeProperty('color');
        element.style.removeProperty('font-weight');
        element.style.removeProperty('text-decoration');
        element.style.removeProperty('vertical-align');
      });

    } else {
      supraArray.forEach((element) => {
        element.style.verticalAlign = 'baseline';
      }); 

      marginArray.forEach((element) => {
        element.style.position = 'static';
        element.style.left = '0px';
        element.style.display = 'inline';
      });

      overArray.forEach((element) => {
        element.style.display = 'none';
      });
    }
    showReadingText = !showReadingText;
  }