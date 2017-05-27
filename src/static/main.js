const uuid = () => {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const form = document.querySelector('#dataform');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    const _id = uuid();
    const body = new FormData(form);
    
    fetch(`/api/data/${_id}`, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify({
            _id,
		    data: form.querySelector('[name=text]').value
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    })
    .then(response => response.json())
    .then(data => {
        const a = document.createElement('a');
        a.href = `/${data._id}`;
        a.innerHTML = `Go to Item: /${data._id}`;
        document.body.appendChild(a);
        console.log(`Data saved, id: ${data._id}`)
    })
    .catch(ex => {
        console.error(ex);
    })
});