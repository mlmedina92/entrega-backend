// recorro los forms para ponerle el evento onsubmit (agregar, editar, eliminar...)
for (const form of document.forms) {
    form.onsubmit = async (e) => {
        e.preventDefault()

        // obtengo los datos a enviar del form
        let formData = {}
        for (const field of e.currentTarget.elements) {
            if (field.type !== 'submit') {
                formData[field.name] = field.value
            }
        }

        // lamada a la API de products
        const api = await fetch(e.currentTarget.action,
            {
                method: e.currentTarget.attributes['method'].value,
                headers: {
                    "Access-Control-Allow-Methods": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
        const data = await api.json()

        if (data.success) {
            alert('Operación existosa!')
        } else {
            alert(JSON.stringify(data))
        }
        
        if (data.redirectTo) {
            window.location.href = data.redirectTo
        }
    }
}
