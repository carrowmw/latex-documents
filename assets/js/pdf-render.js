// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function (pdf) {
    console.log('PDF loaded');

    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function (page) {
        console.log('Page loaded');

        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale });

        // Support HiDPI-screens.
        var outputScale = window.devicePixelRatio || 1;

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        var transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            console.log('Page rendered');
        });
        page.render(renderContext);
    });
}, function (reason) {
    // PDF loading error
    console.error(reason);
});