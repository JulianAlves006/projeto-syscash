<?php
require_once("valida_acesso.php");
?>
<?php
require_once("categoria_crud.php");

//a listagem de categoria é geral poderia ser filtrado por status
if (filter_input(INPUT_SERVER, "REQUEST_METHOD") === "POST") {
    try {
        $erros = [];
        $id = filter_input(INPUT_POST, "id_contareceber", FILTER_VALIDATE_INT);
        $pagina = filter_input(INPUT_POST, "pagina_contareceber", FILTER_VALIDATE_INT);
        $texto_busca = filter_input(INPUT_POST, "texto_busca_contareceber", FILTER_SANITIZE_STRING);

        $sql = "select * from conta_receber where id = ?";

        $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);

        $pre = $conexao->prepare($sql);
        $pre->execute(array(
            $id
        ));

        $resultado = $pre->fetch(PDO::FETCH_ASSOC);
        str_replace(".", ",", $resultado["valor"]);

        if (!$resultado) {
            throw new Exception("Não foi possível realizar a consulta!");
        }
    } catch (Exception $e) {
        $erros[] = $e->getMessage();
        $_SESSION["erros"] = $erros;
    } finally {
        $conexao = null;
    }
}
?>
<br>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-4 d-flex justify-content-start">
                    <h4>Adicionar Contas a Receber</h4>
                </div>
                <div class="col-md-3 d-flex justify-content-center">
                </div>
                <div class="col-md-5 d-flex justify-content-end">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" title="Home" id="home_index_contareceber"><i class="fas fa-home"></i>
                                    <span>Home</span></a></li>
                            <li class="breadcrumb-item"><a href="#" title="Contas a Receber" id="contareceber_index"><i class="fas fa-calendar-plus"></i> <span>Contas a Receber</span></a></li>
                            <li class="breadcrumb-item active" aria-current="page">Adicionar</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <hr>
            <?php
            if (isset($_SESSION["erros"])) {
                echo "<div class='alert alert-warning alert-dismissible fade show' role='alert'>";
                echo "<button type='button' class='btn-close btn-sm' data-bs-dismiss='alert'
                aria-label='Close'></button>";
                foreach ($_SESSION["erros"] as $chave => $valor) {
                    echo $valor . "<br>";
                }
                echo "</div>";
            }
            unset($_SESSION["erros"]);
            ?>
            <div class="alert alert-info alert-dismissible fade show" style="display: none;" id="div_mensagem_registro_contareceber">
                <button type="button" class="btn-close btn-sm" aria-label="Close" id="div_mensagem_registro_botao_contareceber"></button>
                <p id="div_mensagem_registro_texto_contareceber"></p>
            </div>
            <hr>
            <div class="col-md-12">
                <form enctype="multipart/form-data" method="post" accept-charset="utf-8" id="contareceber_dados" role="form" action="">
                    <ul class="nav nav-tabs" id="tab_contareceber" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="dadostab_contareceber" data-bs-toggle="tab" data-bs-target="#dados_contareceber" type="button" role="tab" aria-controls="dados_contareceber" aria-selected="true">Dados</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="complementotab_contareceber" data-bs-toggle="tab" data-bs-target="#complemento_contareceber" type="button" role="tab" aria-controls="complemento_contareceber" aria-selected="false">Complemento</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="tabdados_contareceber">
                        <div class="tab-pane fade show active" id="dados_contareceber" role="tabpanel" aria-labelledby="dados_contareceber">
                            <div class="col-md-6">
                                <label for="descricao" class="form-label">Descrição</label>
                                <input type="text" class="form-control" id="descricao_contareceber" name="descricao_contareceber" maxlength="100" value="<?php echo isset($resultado['descricao']) ? $resultado['descricao'] : ''; ?>" autofocus>
                            </div>
                            <div class="col-md-6">
                                <label for="favorecido" class="form-label">Favorecido</label>
                                <input type="text" class="form-control" id="favorecido_contareceber" name="favorecido_contareceber" maxlength="100" value="<?php echo isset($resultado['favorecido']) ? $resultado['favorecido'] : ''; ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="valor" class="form-label">Valor R$</label>
                                <input type="text" class="form-control" id="valor_contareceber" name="valor_contareceber" value="<?php echo isset($resultado['valor']) ?  str_replace(".", ",", $resultado["valor"]) : ''; ?>">
                            </div>
                        </div>
                        <div class="tab-pane fade" id="complemento_contareceber" role="tabpanel" aria-labelledby="complemento_contareceber">
                            <div class="col-md-6">
                                <label for="valor" class="form-label">Data Vencimento</label>
                                <input type="date" class="form-control" id="datavencimento_contareceber" name="datavencimento_contareceber" value="<?php echo isset($resultado['data_vencimento']) ? $resultado['data_vencimento'] : ''; ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="categoria_contareceber" class="form-label">Categoria</label><select name="categoria_id_contareceber" id="categoria_id_contareceber" class="form-select">
                                    <?php
                                    $categorias = listarCategoriaEntrada();
                                    foreach ($categorias as $categoria) {
                                        if ($categoria["id"] == $resultado['categoria_id']) {
                                            echo "<option value='" . $categoria["id"] . "' selected>" . $categoria["descricao"] . "</option>";
                                        } else {
                                            echo "<option value='" . $categoria["id"] . "'>" . $categoria["descricao"] . "</option>";
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                            <input type="hidden" id="id_contareceber" name="id_contareceber" value="<?php echo isset($id) ? $id : '' ?>" />
                            <input type="hidden" id="usuario_id_contareceber" name="usuario_id_contareceber" value="<?php echo isset($usuario_id) ? $usuario_id : '' ?>" />
                        </div>
                    </div>
                    <br>
                    <div>
                        <button type="button" class="btn btn-primary" id="botao_salvar_contareceber">Salvar</button>
                        <button type="reset" class="btn btn-secondary" id="botao_limpar_contareceber">Limpar</button>
                    </div>
                </form>
            </div>
            <div>
                <input type="hidden" id="pagina_contareceber" name="pagina_contareceber" value="<?php echo isset($pagina) ? $pagina : '' ?>" />
                <input type="hidden" id="texto_busca_contareceber" name="texto_busca_contareceber" value="<?php echo isset($texto_busca) ? $texto_busca : '' ?>" />
            </div>
        </div>
    </div>
</div>

<!--modal de salvar-->
<div class="modal fade" id="modal_salvar_contareceber" tabindex="-1" aria-labelledby="logoutlabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="logoutlabel_contareceber">Pergunta</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Deseja salvar o registro?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="modal_salvar_sim_contareceber">Sim</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>
            </div>
        </div>
    </div>
</div>

<script>
    //devido ao load precisa carregar o arquivo js dessa forma
    var url = "./js/sistema/conta_receber.js";
    $.getScript(url);
</script>