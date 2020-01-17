const deleteProduct = btn => {
    const prodId = btn.parentNode.querySelector('[name=prodId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json();
    })
    .then(data => {
            productElement.parentNode.removeChild(productElement);
        }).catch(function (err) {
        console.log(err);
    });
};
