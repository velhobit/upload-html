let drop_ = document.querySelector('.area-upload #upload-file');
drop_.addEventListener('dragenter', function(){
	document.querySelector('.area-upload .label-upload').classList.add('highlight');
});
drop_.addEventListener('dragleave', function(){
	document.querySelector('.area-upload .label-upload').classList.remove('highlight');
});
drop_.addEventListener('drop', function(){
	document.querySelector('.area-upload .label-upload').classList.remove('highlight');
});

document.querySelector('#upload-file').addEventListener('change', function() {
	var files = this.files;
	for(var i = 0; i < files.length; i++){
		var info = validarArquivo(files[i]);
		
		//Criar barra
		var barra = document.createElement("div");
		var fill = document.createElement("div");
		var text = document.createElement("div");
		barra.appendChild(fill);
		barra.appendChild(text);
		
		barra.classList.add("barra");
		fill.classList.add("fill");
		text.classList.add("text");
		
		if(info.error == undefined){
			text.innerHTML = info.success;
			enviarArquivo(i, barra); //Enviar
		}else{
			text.innerHTML = info.error;
			barra.classList.add("error");
		}
		
		//Adicionar barra
		document.querySelector('.lista-uploads').appendChild(barra);
	};
});

function validarArquivo(file){
	console.log(file);
	// Tipos permitidos
	var mime_types = [ 'image/jpeg', 'image/png' ];
	
	// Validar os tipos
	if(mime_types.indexOf(file.type) == -1) {
		return {"error" : "O arquivo " + file.name + " não permitido"};
	}

	// Apenas 2MB é permitido
	if(file.size > 2*1024*1024) {
		return {"error" : file.name + " ultrapassou limite de 2MB"};
	}

	// Se der tudo certo
	return {"success": "Enviando: " + file.name};
}

function enviarArquivo(indice, barra){
	var data = new FormData();
	var request = new XMLHttpRequest();
	
	//Adicionar arquivo
	data.append('file', document.querySelector('#upload-file').files[indice]);
	
	// AJAX request finished
	request.addEventListener('load', function(e) {
		// Resposta
		if(request.response.status == "success"){
			barra.querySelector(".text").innerHTML = "<a href=\"" + request.response.path + "\" target=\"_blank\">" + request.response.name + "</a> <i class=\"fas fa-check\"></i>";
			barra.classList.add("complete");
		}else{
			barra.querySelector(".text").innerHTML = "Erro ao enviar: " + request.response.name;
			barra.classList.add("error");
		}
	});
	
	// Calcular e mostrar o progresso
	request.upload.addEventListener('progress', function(e) {
		var percent_complete = (e.loaded / e.total)*100;
		
		barra.querySelector(".fill").style.minWidth = percent_complete + "%"; 
	});
	
	//Resposta em JSON
	request.responseType = 'json';
	
	// Caminho
	request.open('post', 'upload.php'); 
	request.send(data);
}