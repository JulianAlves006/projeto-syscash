<?php
require_once("valida_acesso.php");
?>
<?php
require_once("conexao.php");
require_once("categoria_crud.php");

if (filter_input(INPUT_SERVER, "REQUEST_METHOD") === "POST") {
    try {
        $erros = [];
        $id = filter_input(INPUT_POST, "id_contapagar", FILTER_VALIDATE_INT);
        $pagina = filter_input(INPUT_POST, "pagina_contapagar", FILTER_VALIDATE_INT);
        $texto_busca = filter_input(INPUT_POST, "texto_busca_contapagar", FILTER_SANITIZE_STRING);

        $sql = "select * from conta_pagar where id = ?";

        $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);

        $pre = $conexao->prepare($sql);
        $pre->execute(array(
            $id
        ));

        $resultado = $pre->fetch(PDO::FETCH_ASSOC);
        if (!$resultado) {
            throw new Exception("Não foi possível realizar a consulta!");
        }

        $select = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);

        $pro = $select->prepare('SELECT * FROM favorecido WHERE id = ?');
        $pro->execute(array(
            $resultado['favorecido']
        ));
        $favorecido = $pro->fetch(PDO::FETCH_ASSOC);

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
                    <h4>Visualizar Contas a Pagar</h4>
                </div>
                <div class="col-md-3 d-flex justify-content-center">
                </div>
                <div class="col-md-5 d-flex justify-content-end">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#" title="Home" id="home_index_contapagar"><i class="fas fa-home"></i>
                                    <span>Home</span></a></li>
                            <li class="breadcrumb-item"><a href="#" title="Contas a pagar" id="contapagar_index"><i class="fas fa-calendar-plus"></i> <span>Contas a pagar</span></a></li>
                            <li class="breadcrumb-item active" aria-current="page">Visualizar</li>
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
            <hr>
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs" id="tab_contapagar" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="dadostab_contapagar" data-bs-toggle="tab" data-bs-target="#dados_contapagar" type="button" role="tab" aria-controls="dados_contapagar" aria-selected="true">Dados</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="complementotab_contapagar" data-bs-toggle="tab" data-bs-target="#complemento_contapagar" type="button" role="tab" aria-controls="complemento_contapagar" aria-selected="false">Complemento</button>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content" id="tabdados_contapagar">
                        <div class="tab-pane fade show active" id="dados_contapagar" role="tabpanel" aria-labelledby="dados_contapagar">
                            <h4>
                                <b><?= isset($resultado["id"]) ? $resultado["id"] : "" ?></b>
                                <b><?= " - "  ?></b>
                                <b><?= isset($resultado["descricao"]) ? $resultado["descricao"] : "" ?></b>
                            </h4>
                            <br>
                            <dl>
                                <dt>Descrição</dt>
                                <dd>
                                    <?= isset($resultado["descricao"]) ? $resultado["descricao"] : ""; ?>
                                </dd>
                            </dl>
                            <dl>
                                <dt>Favorecido</dt>
                                <dd>
                                    <?= isset($favorecido["nome"]) ? $favorecido["nome"] : ""; ?>
                                </dd>
                            </dl>
                            <dl>
                                <dt>Valor R$</dt>
                                <dd>
                                    <?= isset($resultado["valor"]) ? number_format($resultado["valor"], 2, ',', '.') : ""; ?>
                                </dd>
                            </dl>
                        </div>
                        <div class="tab-pane fade" id="complemento_contapagar" role="tabpanel" aria-labelledby="complemento_contapagar">
                            <dl>
                                <dt>Vencimento</dt>
                                <dd>
                                    <?= isset($resultado["data_vencimento"]) ?
                                        date("d/m/Y", strtotime($resultado["data_vencimento"])) : ""; ?>
                                </dd>
                            </dl>
                            <dl>
                                <dt>Categoria</dt>
                                <dd>
                                    <?= isset($resultado["valor"]) ? buscarCategoria($resultado["categoria_id"])[0]["descricao"] : ""; ?>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <input type="hidden" id="pagina_contapagar" name="pagina" value="<?php echo isset($pagina) ? $pagina : '' ?>" />
                    <input type="hidden" id="texto_busca_contapagar" name="texto_busca_contapagar" value="<?php echo isset($texto_busca) ? $texto_busca : '' ?>" />
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    //devido ao load precisa carregar o arquivo js dessa forma
    var url = "./js/sistema/conta_pagar.js";
    $.getScript(url);
</script>