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
//Show alert when exceeding page limit
const showAlert = (msg) => {
    let alert_msg = document.querySelector('#alert');
    document.querySelector('#alert-message').textContent = msg;
    alert_msg.style.visibility = 'visible';
    setTimeout(() => {
        alert_msg.style.visibility = 'hidden';
    }, 1500);
}
//Prev Page 
const showPrevPage = () => {  
    if(pageNum <= 1){
        showAlert("You have reached the first page!")        
        return;
    }
    //UPDATE: are there neater ways to make alert message invisible
    document.querySelector('#alert').style.visibility = 'hidden';
    pageNum--;
    queueRenderPage(pageNum);
}

//Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        showAlert("You have reached the last page!")
        return;
    }
    document.querySelector('#alert').style.visibility = 'hidden';
    pageNum++;
    queueRenderPage(pageNum);
}

//Fetch Doc
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
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



