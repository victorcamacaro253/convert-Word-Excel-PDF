document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneIcon
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateFileInfo(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateFileInfo(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
    });
});

/**
 * Updates the drop zone with file name and size.
 */
function updateFileInfo(dropZoneElement, file) {
    let fileInfoElement = dropZoneElement.querySelector(".drop-zone__info");

    const dropZoneIcon = dropZoneElement.querySelector(".drop-zone__icon"); // Seleccionamos el icono


    // Remove prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no file info element, so create it
    if (!fileInfoElement) {
        fileInfoElement = document.createElement("div");
        fileInfoElement.classList.add("drop-zone__info");
        dropZoneElement.appendChild(fileInfoElement);
    }

    // Display file name and size (in KB or MB)
    const fileSize = (file.size / 1024).toFixed(2); // Convert bytes to KB
    const sizeUnit = fileSize > 1024 ? (fileSize / 1024).toFixed(2) + ' MB' : fileSize + ' KB';
    fileInfoElement.textContent = `Archivo: ${file.name} (${sizeUnit})`;

    // Cambiar icono según el tipo de archivo
switch (file.type) {
    case 'application/pdf':
        dropZoneIcon.src = '/img/pdf.png'; // Icono de PDF en Flaticon
        break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            dropZoneIcon.src = '/img/documento-de-word.png'; // Icono de Word
            break;

    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        dropZoneIcon.src = '/img/excel.png'; // Icono de Excel en Flaticon
        break;
    default:
        dropZoneIcon.className = '/img/pdf.png'; // Icono de archivo genérico en Flaticon
}
}
