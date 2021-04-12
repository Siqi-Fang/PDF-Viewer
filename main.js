/* Module (pdfjsLib) Methods:
     getDocument(src) => PDFDocumentLoadingTask
        .promise: loading task completion status*/
const url = 'docs/sample.pdf'
//Rendering Poperties
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

//Canvas Properties 
const scale = 1.2,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

const renderPage = num => {
    pageIsRendering = true;

    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }
        page.render(renderCtx).promise.then(()=>{
            pageIsRendering = false;
            
            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending =null;
            }
        });
        //Output curr page
        document.querySelector('#page-num').textContent = num;
    });
};
//Check for page rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num; //next in line?
    }else{
    renderPage(num);}//render now?
}

//Prev Page  Update: Add alert
const showPrevPage = () => {
    if(pageNum <= 1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}
//Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

//Fetch Doc
pdfjsLib.getDocument(url).promise.then(pdfDoc_=>{
    pdfDoc = pdfDoc_;
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
})

//Button Events
document.getElementById('prev-page').addEventListener(
    'click',showPrevPage);
document.getElementById('next-page').addEventListener(
    'click', showNextPage);
