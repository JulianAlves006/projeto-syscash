$(document).ready(function () {
	//configurando a tabela de dados listados
	$("#lista_favorecido").DataTable({
		columnDefs: [{
			targets: [2],
			orderable: false
		}],
		destroy: true,
		info: false,
		language: {
			decimal: ",",
			thousands: "."
		},
		order: [
			[0, "asc"]
		],
		ordering: true,
		paging: false,
		searching: false
	});

	//configurando validação dos dados digitados no cadastro/edição
	$("#favorecido_dados").validate({
		rules: {
			descricao_favorecido: {
				required: true
			},
			tipo_favorecido: {
				required: true
			}
		},
		highlight: function (element) {
			$(element).addClass("is-invalid");
		},
		unhighlight: function (element) {
			$(element).removeClass("is-invalid");
		},
		errorElement: "div",
		errorClass: "invalid-feedback",
		errorPlacement: function (error, element) {
			if (element.parent(".input-group-prepend").length) {
				$(element).siblings(".invalid-feedback").append(error);
			} else {
				error.insertAfter(element);
			}
		},
		messages: {
			descricao_favorecido: {
				required: "Este campo não pode ser vazio!"
			},
			tipo_favorecido: {
				required: "Este campo não pode ser vazio!",
			}
		}
	});

	//clicar no botão da div de erros e escondendo as mensagens de erros de validação da listagem
	$("#div_mensagem_botao_favorecido").click(function () {
		$("#div_mensagem_favorecido").hide();
	});

	//clicar no botão da div de erros e escondendo as mensagens de erros de validação do registro
	$("#div_mensagem_registro_botao_favorecido").click(function () {
		$("#div_mensagem_registro_favorecido").hide();
	});

	//voltando para a página inicial do menu do sistema
	$("#home_index_favorecido").click(function () {
		$(location).prop("href", "menu.php");
	});

	//voltando para a página de listagem de favorecido na mesma página onde ocorreu a chamada
	$("#favorecido_index").click(function (e) {
		e.stopImmediatePropagation();

		$("#conteudo").load("favorecido_index.php", {
			pagina_favorecido: $("#pagina_favorecido").val(),
			texto_busca_favorecido: $("#texto_busca_favorecido").val()
		});
	});

	//botão limpar do cadastro de informações
	$("#botao_limpar_favorecido").click(function () {
		$("#nome").focus();
		$("#favorecido_dados").each(function () {
			$(this).find(":input").removeClass("is-invalid");
			$(this).find(":input").removeAttr("value");
		});
	});

	//botão salvar do cadastro de informações
	$("#botao_salvar_favorecido").click(function (e) {
		$("#modal_salvar_favorecido").modal("show");
	});

	//botão sim da pergunta de salvar as informações de cadastro
	$("#modal_salvar_sim_favorecido").click(function (e) {
		e.stopImmediatePropagation();

		if (!$("#favorecido_dados").valid()) {
			$("#modal_salvar_favorecido").modal("hide");
			return;
		}

		var dados = $("#favorecido_dados").serializeArray().reduce(function (vetor, obj) {
			vetor[obj.name] = obj.value;
			return vetor;
		}, {});
		var operacao = null;

		$("#carregando_favorecido").removeClass("d-none");

		if ($.trim($("#id_favorecido").val()) != "") {
			operacao = "editar";
		} else {
			operacao = "adicionar";
		}
		dados = JSON.stringify(dados);

		$.ajax({
			type: "POST",
			cache: false,
			url: "favorecido_crud.php",
			data: {
				acao: operacao,
				registro: dados
			},
			dataType: "json",
			success: function (e) {
				$("#conteudo").load("favorecido_index.php", {
					pagina_favorecido: $("#pagina_favorecido").val(),
					texto_busca_favorecido: $("#texto_busca_favorecido").val()
				}, function () {
					$("#div_mensagem_texto_favorecido").empty().append("favorecido cadastrada!");
					$("#div_mensagem_favorecido").show();
				});
			},
			error: function (e) {
				$("#div_mensagem_registro_texto_favorecido").empty().append(e.responseText);
				$("#div_mensagem_registro_favorecido").show();
			},
			complete: function () {
				$("#modal_salvar_favorecido").modal("hide");
				$("#carregando_favorecido").addClass("d-none");
			}
		});
	});

	//botão adicionar da tela de listagem de registros
	$("#botao_adicionar_favorecido").click(function (e) {
		e.stopImmediatePropagation();

		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var pagina = $("#pagina_favorecido.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_favorecido").val();

		$("#conteudo").load("favorecido_add.php", function () {
			$("#carregando_favorecido").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "favorecido_add.php",
				data: {
					pagina_favorecido: pagina,
					texto_busca_favorecido: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
					$("#div_mensagem_favorecido").show();
				},
				complete: function () {
					$("#carregando_favorecido").addClass("d-none");
				}
			});
		});
	});

	//botão pesquisar da tela de listagem de registros
	$("#botao_pesquisar_favorecido").click(function (e) {
		e.stopImmediatePropagation();

		$("#carregando_favorecido").removeClass("d-none");

		$.ajax({
			type: "POST",
			cache: false,
			url: "favorecido_index.php",
			data: {
				texto_busca_favorecido: $("#texto_busca_favorecido").val()
			},
			dataType: "html",
			success: function (e) {
				$("#conteudo").empty().append(e);
			},
			error: function (e) {
				$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
				$("#div_mensagem_favorecido").show();
			},
			complete: function () {
				$("#carregando_favorecido").addClass("d-none");
			}
		});
	});

	//botão editar da tela de listagem de registros
	$(document).on("click", "#botao_editar_favorecido", function (e) {
		e.stopImmediatePropagation();
		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var id = $(this).attr("chave");
		var pagina = $("#pagina_favorecido.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_favorecido").val();

		$("#conteudo").load("favorecido_edit.php", function () {
			$("#carregando_favorecido").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "favorecido_edit.php",
				data: {
					id_favorecido: id,
					pagina_favorecido: pagina,
					texto_busca_favorecido: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
					$("#div_mensagem_favorecido").show();
				},
				complete: function () {
					$("#carregando_favorecido").addClass("d-none");
				}
			});
		});
	});

	//botão visualizar da tela de listagem de registros
	$(document).on("click", "#botao_view_favorecido", function (e) {
		e.stopImmediatePropagation();
		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var id = $(this).attr("chave");
		var pagina = $("#pagina_favorecido.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_favorecido").val();

		$("#conteudo").load("favorecido_view.php", function () {
			$("#carregando_favorecido").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "favorecido_view.php",
				data: {
					id_favorecido: id,
					pagina_favorecido: pagina,
					texto_busca_favorecido: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
					$("#div_mensagem_favorecido").show();
				},
				complete: function () {
					$("#carregando_favorecido").addClass("d-none");
				}
			});
		});
	});

	//botão paginação da tela de listagem de registros
	$(document).on("click", "#pagina_favorecido", function (e) {
		//Aqui como links de botões têm o mesmo nome é necessário parar as chamadas
		e.stopImmediatePropagation();

		var texto_busca = $("#texto_busca_favorecido").val();
		var pagina = $(this).val();
		$("#carregando_favorecido").removeClass("d-none");

		$.ajax({
			type: "POST",
			cache: false,
			url: "favorecido_index.php",
			data: {
				pagina_favorecido: pagina,
				texto_busca_favorecido: texto_busca
			},
			dataType: "html",
			success: function (e) {
				$("#conteudo").empty().append(e);
			},
			error: function (e) {
				$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
				$("#div_mensagem_favorecido").show();
			},
			complete: function () {
				$("#carregando_favorecido").addClass("d-none");
				$("#texto_busca_favorecido").text(texto_busca);
			}
		});
	});

	//botão excluir da tela de listagem de registros
	$(document).on("click", "#botao_excluir_favorecido", function (e) {
		e.stopImmediatePropagation();

		confirmaExclusao(this);
	});

	function confirmaExclusao(registro) {
		$("#modal_excluir_favorecido").modal("show");
		$("#id_excluir_favorecido").val($(registro).attr("chave"));
	}

	//botão sim da pergunta de excluir de listagem de registros
	$("#modal_excluir_sim_favorecido").click(function () {
		excluirRegistro();
	});

	//operação de exclusão do registro
	function excluirRegistro() {
		var registro = new Object();
		var registroJson = null;

		registro.id = $("#id_excluir_favorecido").val();
		registroJson = JSON.stringify(registro);

		$.ajax({
			type: "POST",
			cache: false,
			url: "favorecido_crud.php",
			data: {
				acao: "excluir",
				registro: registroJson
			},
			dataType: "json",
			success: function () {
				$("#div_mensagem_texto_favorecido").empty().append("favorecido excluída!");
				$("#div_mensagem_favorecido").show();
				$("tr#" + registro.id + "_favorecido").remove();
			},
			error: function (e) {
				$("#div_mensagem_texto_favorecido").empty().append(e.responseText);
				$("#div_mensagem_favorecido").show();
			},
			complete: function () {
				$("#modal_excluir_favorecido").modal("hide");
			}
		});
	}
});