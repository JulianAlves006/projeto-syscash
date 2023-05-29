<?php

function validaDados($registro)
{
    $erros = [];

    if (!filter_var($registro->descricao_contapagar, FILTER_SANITIZE_STRING)) {
        $erros["descricao_contapagar"] =  "Descrição: Campo vazio e ou informação inválida!";
    }

    if (!filter_var($registro->favorecido_contapagar, FILTER_SANITIZE_STRING)) {
        $erros["favorecido_contapagar"] =  "Favorecido: Campo vazio e ou informação inválida!";
    }

    //retirar a máscara nessa sequência
    $registro->valor_contapagar = str_replace(".","",$registro->valor_contapagar);
    $registro->valor_contapagar = str_replace(",",".",$registro->valor_contapagar);
    if (!filter_var($registro->valor_contapagar, FILTER_VALIDATE_FLOAT)) {
        $erros["valor_contapagar"] =  "Valor R$: Campo vazio e ou informação inválida!";
    }

    if (!filter_var($registro->datavencimento_contapagar, FILTER_SANITIZE_STRING)) {
        $erros["datavencimento_contapagar"] =  "Data Vencimento: Campo vazio e ou informação inválida!";
    }

    if (!filter_var($registro->categoria_id_contapagar, FILTER_SANITIZE_STRING)) {
        $erros["categoria_id_contapagar"] =  "Categoria: Campo vazio e ou informação inválida!";
    }

    if (count($erros) > 0) {
        $_SESSION["erros"] = $erros;
        throw new Exception("Erro nas informações!");
    }
}
