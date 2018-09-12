function disableFooter() {
    const footer = getDomElement('footer');
    footer.style.display = 'none';
}

function enableFooter() {
    const footer = getDomElement('footer');
    footer.style.display = 'block';
}
