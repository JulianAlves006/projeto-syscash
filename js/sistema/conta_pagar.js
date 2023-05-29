$(document).ready(function () {
	//configurando a tabela de dados listados
	$("#lista_contapagar").DataTable({
		columnDefs: [{
			targets: [6],
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
	$("#contapagar_dados").validate({
		rules: {
			descricao_contapagar: {
				required: true
			},
			favorecido_contapagar: {
				required: true
			},
			valor_contapagar: {
				required: true
			},
			datavencimento_contapagar: {
				required: true
			},
			categoria_id_contapagar: {
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
			descricao_contapagar: {
				required: "Este campo não pode ser vazio!"
			},
			favorecido_contapagar: {
				required: "Este campo não pode ser vazio!"
			},
			valor_contapagar: {
				required: "Este campo não pode ser vazio!"
			},
			datavencimento_contapagar: {
				required: "Este campo não pode ser vazio!",
			},
			categoria_id_contapagar: {
				required: "Este campo não pode ser vazio!",
			}
		}
	});

	$("#valor_contapagar").inputmask("currency", {
		autoUnmask: true,
		radixPoint: ",",
		groupSeparator: ".",
		allowMinus: false,
		prefix: 'R$ ',
		digits: 2,
		digitsOptional: false,
		rightAlign: true,
		unmaskAsNumber: false
	});

	//clicar no botão da div de erros e escondendo as mensagens de erros de validação da listagem
	$("#div_mensagem_botao_contapagar").click(function () {
		$("#div_mensagem_contapagar").hide();
	});

	//clicar no botão da div de erros e escondendo as mensagens de erros de validação do registro
	$("#div_mensagem_registro_botao_contapagar").click(function () {
		$("#div_mensagem_registro_contapagar").hide();
	});

	//voltando para a página inicial do menu do sistema
	$("#home_index_contapagar").click(function () {
		$(location).prop("href", "menu.php");
	});

	//voltando para a página de listagem de contas a pagar na mesma página onde ocorreu a chamada
	$("#contapagar_index").click(function (e) {
		e.stopImmediatePropagation();

		$("#conteudo").load("conta_pagar_index.php", {
			pagina_contapagar: $("#pagina_contapagar").val(),
			texto_busca_contapagar: $("#texto_busca_contapagar").val()
		});
	});

	//botão limpar do cadastro de informações
	$("#botao_limpar_contapagar").click(function () {
		$("#nome").focus();
		$("#contapagar_dados").each(function () {
			$(this).find(":input").removeClass("is-invalid");
			$(this).find(":input").removeAttr("value");
		});
	});

	//botão salvar do cadastro de informações
	$("#botao_salvar_contapagar").click(function (e) {
		$("#modal_salvar_contapagar").modal("show");
	});

	//botão sim da pergunta de salvar as informações de cadastro
	$("#modal_salvar_sim_contapagar").click(function (e) {
		e.stopImmediatePropagation();

		if (!$("#contapagar_dados").valid()) {
			$("#modal_salvar_contapagar").modal("hide");
			return;
		}

		var dados = $("#contapagar_dados").serializeArray().reduce(function (vetor, obj) {
			vetor[obj.name] = obj.value;
			return vetor;
		}, {});
		var operacao = null;

		$("#carregando_contapagar").removeClass("d-none");

		if ($.trim($("#id_contapagar").val()) != "") {
			operacao = "editar";
		} else {
			operacao = "adicionar";
		}
		dados = JSON.stringify(dados);

		$.ajax({
			type: "POST",
			cache: false,
			url: "conta_pagar_crud.php",
			data: {
				acao: operacao,
				registro: dados
			},
			dataType: "json",
			success: function (e) {
				$("#conteudo").load("conta_pagar_index.php", {
					pagina_contapagar: $("#pagina_contapagar").val(),
					texto_busca_contapagar: $("#texto_busca_contapagar").val()
				}, function () {
					$("#div_mensagem_texto_contapagar").empty().append("Contas a pagar cadastrada!");
					$("#div_mensagem_contapagar").show();
				});
			},
			error: function (e) {
				$("#div_mensagem_registro_texto_contapagar").empty().append(e.responseText);
				$("#div_mensagem_registro_contapagar").show();
			},
			complete: function () {
				$("#modal_salvar_contapagar").modal("hide");
				$("#carregando_contapagar").addClass("d-none");
			}
		});
	});

	//botão adicionar da tela de listagem de registros
	$("#botao_adicionar_contapagar").click(function (e) {
		e.stopImmediatePropagation();

		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var pagina = $("#pagina_contapagar.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_contapagar").val();

		$("#conteudo").load("conta_pagar_add.php", function () {
			$("#carregando_contapagar").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "conta_pagar_add.php",
				data: {
					pagina_contapagar: pagina,
					texto_busca_contapagar: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
					$("#div_mensagem_contapagar").show();
				},
				complete: function () {
					$("#carregando_contapagar").addClass("d-none");
				}
			});
		});
	});

	//botão pesquisar da tela de listagem de registros
	$("#botao_pesquisar_contapagar").click(function (e) {
		e.stopImmediatePropagation();

		$("#carregando_contapagar").removeClass("d-none");

		$.ajax({
			type: "POST",
			cache: false,
			url: "conta_pagar_index.php",
			data: {
				texto_busca_contapagar: $("#texto_busca_contapagar").val()
			},
			dataType: "html",
			success: function (e) {
				$("#conteudo").empty().append(e);
			},
			error: function (e) {
				$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
				$("#div_mensagem_contapagar").show();
			},
			complete: function () {
				$("#carregando_contapagar").addClass("d-none");
			}
		});
	});

	//botão editar da tela de listagem de registros
	$(document).on("click", "#botao_editar_contapagar", function (e) {
		e.stopImmediatePropagation();
		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var id = $(this).attr("chave");
		var pagina = $("#pagina_contapagar.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_contapagar").val();

		$("#conteudo").load("conta_pagar_edit.php", function () {
			$("#carregando_contapagar").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "conta_pagar_edit.php",
				data: {
					id_contapagar: id,
					pagina_contapagar: pagina,
					texto_busca_contapagar: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
					$("#div_mensagem_contapagar").show();
				},
				complete: function () {
					$("#carregando_contapagar").addClass("d-none");
				}
			});
		});
	});

	//botão visualizar da tela de listagem de registros
	$(document).on("click", "#botao_view_contapagar", function (e) {
		e.stopImmediatePropagation();
		//levando os elementos para tela de consulta para depois realizar as buscas/pesquisas
		var id = $(this).attr("chave");
		var pagina = $("#pagina_contapagar.btn.btn-primary.btn-sm").val();
		var texto_busca = $("#texto_busca_contapagar").val();

		$("#conteudo").load("conta_pagar_view.php", function () {
			$("#carregando_contapagar").removeClass("d-none");

			$.ajax({
				type: "POST",
				cache: false,
				url: "conta_pagar_view.php",
				data: {
					id_contapagar: id,
					pagina_contapagar: pagina,
					texto_busca_contapagar: texto_busca
				},
				dataType: "html",
				success: function (e) {
					$("#conteudo").empty().append(e);
				},
				error: function (e) {
					$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
					$("#div_mensagem_contapagar").show();
				},
				complete: function () {
					$("#carregando_contapagar").addClass("d-none");
				}
			});
		});
	});

	//botão paginação da tela de listagem de registros
	$(document).on("click", "#pagina_contapagar", function (e) {
		//Aqui como links de botões têm o mesmo nome é necessário parar as chamadas
		e.stopImmediatePropagation();

		var texto_busca = $("#texto_busca_contapagar").val();
		var pagina = $(this).val();
		$("#carregando_contapagar").removeClass("d-none");

		$.ajax({
			type: "POST",
			cache: false,
			url: "conta_pagar_index.php",
			data: {
				pagina_contapagar: pagina,
				texto_busca_contapagar: texto_busca
			},
			dataType: "html",
			success: function (e) {
				$("#conteudo").empty().append(e);
			},
			error: function (e) {
				$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
				$("#div_mensagem_contapagar").show();
			},
			complete: function () {
				$("#carregando_contapagar").addClass("d-none");
				$("#texto_busca_contapagar").text(texto_busca);
			}
		});
	});

	//botão excluir da tela de listagem de registros
	$(document).on("click", "#botao_excluir_contapagar", function (e) {
		e.stopImmediatePropagation();

		confirmaExclusao(this);
	});

	function confirmaExclusao(registro) {
		$("#modal_excluir_contapagar").modal("show");
		$("#id_excluir_contapagar").val($(registro).attr("chave"));
	}

	//botão sim da pergunta de excluir de listagem de registros
	$("#modal_excluir_sim_contapagar").click(function () {
		excluirRegistro();
	});

	//operação de exclusão do registro
	function excluirRegistro() {
		var registro = new Object();
		var registroJson = null;

		registro.id = $("#id_excluir_contapagar").val();
		registroJson = JSON.stringify(registro);

		$.ajax({
			type: "POST",
			cache: false,
			url: "conta_pagar_crud.php",
			data: {
				acao: "excluir",
				registro: registroJson
			},
			dataType: "json",
			success: function () {
				$("#div_mensagem_texto_contapagar").empty().append("Contas a pagar excluída!");
				$("#div_mensagem_contapagar").show();
				$("tr#" + registro.id + "_contapagar").remove();
			},
			error: function (e) {
				$("#div_mensagem_texto_contapagar").empty().append(e.responseText);
				$("#div_mensagem_contapagar").show();
			},
			complete: function () {
				$("#modal_excluir_contapagar").modal("hide");
			}
		});
	}
});