const gridContainer = document.querySelector('.grid-container');
const previewChartContainer = document.getElementById('preview-chart');
let boxBackgroundColor = "#3B5372";
let fontColor = "#FFF";
let titleColor = "#3B5372";
let boxBorderThick = 0;
let boxBorderColor = "#000";
let boxBorderRadius = "12";
let boxCharWidth = "100";

gridContainer.addEventListener("mouseleave", removeHover);
previewChartContainer.addEventListener('input', generateHTML);

for (let i = 0; i < 6; i++) {
	for (let j = 0; j < 6; j++) {
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.setAttribute('row', i + 1);
		gridItem.setAttribute('col', j + 1);
		gridItem.addEventListener('mouseover', onGridItemHover);
		gridItem.addEventListener('click', onGridItemClick);

		gridContainer.appendChild(gridItem);
	}
}

function removeHover() {
	const gridItemsHover = document.querySelectorAll('.grid-item.hover');
	gridItemsHover.forEach(item => {
		item.classList.remove('hover');
	});
}

function onGridItemHover(e) {
	const numRows = e.target.getAttribute('row');
	const numCols = e.target.getAttribute('col');
	const gridItems = document.querySelectorAll('.grid-item');

	gridItems.forEach(item => {
		const itemRow = item.getAttribute('row');
		const itemCol = item.getAttribute('col')
		if (itemRow <= numRows && itemCol <= numCols) {
			item.classList.add('hover')
		}
		else {
			item.classList.remove('hover')
		}
	});
}

function addSelectedClass(numRows, numCols) {
	const gridItems = document.querySelectorAll('.grid-item');

	gridItems.forEach(item => {
		const itemRow = item.getAttribute('row');
		const itemCol = item.getAttribute('col')
		if (itemRow <= numRows && itemCol <= numCols) {
			item.classList.add('selected')
		}
		else {
			item.classList.remove('selected')
		}
	});
}

function onGridItemClick(e) {
	const numRows = e.target.getAttribute('row');
	const numCols = e.target.getAttribute('col');
	addSelectedClass(numRows, numCols);
	document.getElementById('chart-box-size').innerHTML = `Boxes: ${numRows} x ${numCols}`;

	let previewChartDiv = document.getElementById('preview-chart');
	previewChartDiv.innerHTML = '';

	let figureElement = document.createElement('figure');
	figureElement.classList.add('wp-caption');
	let chartDiv = document.createElement('div');
	chartDiv.classList.add('box-chart');

	for (let i = 0; i < numRows; i++) {
		let rowDiv = document.createElement('div');
		rowDiv.classList.add('box-row');
		for (let j = 0; j < numCols; j++) {
			let colDiv = document.createElement('div');
			colDiv.classList.add('box-container-rounded');
			colDiv.setAttribute('contenteditable', 'true');
			colDiv.innerHTML = '<p>Your content here</p>';
			if (boxBorderThick > 0) {
				colDiv.classList.add('bordered');
			}
			rowDiv.appendChild(colDiv);
		}
		chartDiv.appendChild(rowDiv);
	}
	figureElement.appendChild(chartDiv);
	previewChartDiv.appendChild(figureElement);
	document.querySelector('.inputs-container').classList.remove('hide');
	document.querySelector('#tools-container').classList.remove('hide');
	document.querySelector('#info-container').classList.add('hide');
	
	generateHTML();
	generateCSS();
}

function generateHTML() {
	let editorContent = document.getElementById('preview-chart').innerHTML;
	editorContent = editorContent.replaceAll('contenteditable="true"', '');
	editorContent = editorContent.replaceAll('spellcheck="false"', '');
	editorContent = editorContent.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
	editorContent = editorContent.replace(/<i>(.*?)<\/i>/g, '<em>$1</em>');
	editorContent = editorContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');
	editorContent = editorContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');

	const htmlOutput = document.getElementById('generated-html');
	const formattedHTML = html_beautify(editorContent);
	htmlOutput.textContent = formattedHTML;
	Prism.highlightElement(htmlOutput);
}

function generateCSS() {
	const cssOutput = document.getElementById('generated-css');
	cssOutput.textContent = `.box-chart {
  margin: 0 auto;
  margin-top: 10px;
}

.box-chart > .title {
  color: ${titleColor};
  text-align: center;
}

.box-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px
}

.box-container-rounded {
  background-color: ${boxBackgroundColor};
  border-radius: ${boxBorderRadius}px;
  padding: 10px;
  margin-right: 10px;
  flex: 1;
  color: ${fontColor};
}

.box-container-rounded.bordered {
  border: ${boxBorderThick}px solid ${boxBorderColor};
}

.box-container-rounded h1,
.box-container-rounded h2,
.box-container-rounded h3,
.box-container-rounded h4,
.box-container-rounded h5,
.box-container-rounded h6 {
  color: ${fontColor};
}

@media screen and (max-width: 500px) {
  .box-row {
    flex-direction: column;
    margin-bottom: 0;
  }

  .box-container-rounded {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
	`
	Prism.highlightElement(cssOutput);
}

function execCmd(command, value = null) {
	if (command === 'foreColor') {
		document.execCommand('styleWithCSS', false, true);
		document.execCommand(command, false, value);
	} else if (command === 'createLink') {
		const url = prompt("Enter the URL");
		if (url) {
			document.execCommand(command, false, url);
		}
	} else {
		document.execCommand(command, false, value);
	}
	generateHTML();
}

function applyBoxColor(color) {
	const selection = window.getSelection();
	if (!selection.rangeCount) return;
	const range = selection.getRangeAt(0);
	let container = range.commonAncestorContainer;

	// If the container is a text node (nodeType 3), move up to the parent element
	if (container.nodeType === Node.TEXT_NODE) {
		container = container.parentElement;
	}

	// Traverse up the DOM tree to find the closest .box-container-rounded
	while (container && container.nodeType === Node.ELEMENT_NODE && !container.classList.contains('box-container-rounded')) {
		container = container.parentElement;
	}

	// If a .box-container-rounded is found, apply the background color
	if (container && container.classList.contains('box-container-rounded')) {
		container.style.backgroundColor = color;
	}

	generateHTML();
}

function updateCSS() {
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(`
		.box-container-rounded { 
			border-radius: ${boxBorderRadius}px;
			background-color: ${boxBackgroundColor};
			color: ${fontColor}; 
		}
		.box-container-rounded.bordered {
  		border: ${boxBorderThick}px solid ${boxBorderColor};
		}
		.box-chart > .title { color: ${titleColor}; }
		.box-container-rounded h1,
		.box-container-rounded h2,
		.box-container-rounded h3,
		.box-container-rounded h4,
		.box-container-rounded h5,
		.box-container-rounded h6 {
			color: ${fontColor};
		}
		`);
	document.adoptedStyleSheets = [sheet];
	generateCSS();
}

function applyGeneralBoxColor(color) {
	boxBackgroundColor = color;
	updateCSS();
}

function applyGeneralFontColor(color) {
	fontColor = color;
	updateCSS();
}

function applyTitleFontColor(color) {
	titleColor = color;
	updateCSS();
}

function updateChartTitle(title) {
	const boxChartContainer = document.querySelector('.box-chart');
	if (title === '') {
		if(boxChartContainer.querySelector('.box-chart .title')){
			boxChartContainer.querySelector('.box-chart .title').remove();
		}
		document.querySelector('#titleColor').classList.add('hide');
	} else {
		if (boxChartContainer.querySelector('.box-chart .title')) {
			boxChartContainer.querySelector('.box-chart .title').innerText = title;
		} else {
			let chartTitle = document.createElement('h3');
			chartTitle.classList.add('title');
			chartTitle.innerText = title;
			boxChartContainer.prepend(chartTitle);
		}
		document.querySelector('#titleColor').classList.remove('hide');
	}
	generateHTML();
}

function updateChartCaption(caption) {
	let figureElement = document.querySelector('figure');
	if (caption === '' && figureElement.querySelector('figcaption')) {
		figureElement.querySelector('figcaption').remove();

	} else {
		if (figureElement.querySelector('figcaption')) {
			figureElement.querySelector('figcaption').textContent = caption;
		} else {
			let chartCaption = document.createElement('figcaption');
			chartCaption.classList.add('wp-caption-text');
			chartCaption.textContent = caption;
			figureElement.append(chartCaption);
		}
	}
	generateHTML();
}

function updateBoxChartWidth(value){
	boxCharWidth = value;
	document.querySelector('#box-chart-width-value').innerText = `${boxCharWidth}%`;
	document.querySelector('.box-chart').style.width = `${boxCharWidth}%`
	generateHTML();
}

function updateBorderThick(thick) {
	boxBorderThick = thick;
	const boxes = document.querySelectorAll('.box-container-rounded');

	if (boxBorderThick > 0) {
		document.querySelector('#boxBorderColor').classList.remove('hide');
		boxes.forEach(element => {
			element.classList.add('bordered');
		});
	} else {
		document.querySelector('#boxBorderColor').classList.add('hide');
		boxes.forEach(element => {
			element.classList.remove('bordered');
		});
	}
	document.querySelector('#box-border-thick-value').innerText = `${boxBorderThick}px`;
	generateHTML();
	updateCSS();
}

function applyBoxBorderColor(color) {
	boxBorderColor = color;
	updateCSS();
}

function updateBorderRadius(radius) {
	boxBorderRadius = radius;
	if (radius === ''){
		boxBorderRadius = 0;
	}
	updateCSS();
}

function openTab(evt, tab) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tab).style.display = "block";
	evt.currentTarget.className += " active";
}

function copy(id) {
	let codeText = document.getElementById(id).textContent;
	navigator.clipboard.writeText(codeText);
	const copyButton = document.getElementById(`btn-copy-${id}`);
	const originalText = '<i class="fa-regular fa-copy"></i>Copy';
	copyButton.innerHTML = '<i class="fa-solid fa-check"></i>Copied!';

	setTimeout(() => {
		copyButton.innerHTML = originalText;
	}, 2000);
};
