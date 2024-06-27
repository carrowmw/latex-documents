if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
  alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
}

pdfjsLib.GlobalWorkerOptions.workerSrc = "../../../pdf.worker.mjs";

const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const DEFAULT_URL = "https://storage.googleapis.com/phd-latex-documents-my-pdfs/20240624_DMP.pdf";
const ENABLE_XFA = true;
const SEARCH_FOR = "";

const SANDBOX_BUNDLE_SRC = new URL("../../../pdf.sandbox.mjs", window.location);
const container = document.getElementById("viewerContainer");
const eventBus = new pdfjsViewer.EventBus();

const pdfLinkService = new pdfjsViewer.PDFLinkService({ eventBus });
const pdfFindController = new pdfjsViewer.PDFFindController({ eventBus, linkService: pdfLinkService });
const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({ eventBus, sandboxBundleSrc: SANDBOX_BUNDLE_SRC });

const pdfViewer = new pdfjsViewer.PDFViewer({
  container,
  eventBus,
  linkService: pdfLinkService,
  findController: pdfFindController,
  scriptingManager: pdfScriptingManager,
});

pdfLinkService.setViewer(pdfViewer);
pdfScriptingManager.setViewer(pdfViewer);

eventBus.on("pagesinit", function () {
  pdfViewer.currentScaleValue = "0.75";

  if (SEARCH_FOR) {
    eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
  }
});

const loadingTask = pdfjsLib.getDocument({
  url: DEFAULT_URL,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
  enableXfa: ENABLE_XFA,
});

const pdfDocument = await loadingTask.promise;
pdfViewer.setDocument(pdfDocument);
pdfLinkService.setDocument(pdfDocument, null);

// Zoom functionality
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

zoomInButton.addEventListener("click", () => {
  const currentScale = pdfViewer.currentScale;
  pdfViewer.currentScale = currentScale + 0.1;
});

zoomOutButton.addEventListener("click", () => {
  const currentScale = pdfViewer.currentScale;
  pdfViewer.currentScale = currentScale - 0.1;
});