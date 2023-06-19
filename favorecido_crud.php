<?php
require_once("valida_acesso.php");
?>
<?php
require_once("conexao.php");
require_once("favorecido_filtro.php");

//operações via ajax
if (filter_input(INPUT_SERVER, "REQUEST_METHOD") === "POST") {
    if (!isset($_POST["acao"])) {
        return;
    }

    switch ($_POST["acao"]) {
        case "adicionar":
            try {
                $errosAux = "";

                $registro = new stdClass();
                $registro = json_decode($_POST['registro']);

                $sql = "insert into favorecido(nome, usuario_id) VALUES (?, ?) ";
                $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                $pre = $conexao->prepare($sql);
                $pre->execute(array(
                    $registro->descricao_favorecido,
                    $registro->usuario_id_favorecido
                ));
                print json_encode($conexao->lastInsertId());
            } catch (Exception $e) {
                if (isset($_SESSION["erros"])) {
                    foreach ($_SESSION["erros"] as $chave => $valor) {
                        $errosAux .= $valor . "<br>";
                    }
                }
                $errosAux .= $e->getMessage();
                unset($_SESSION["erros"]);
                echo "Erro: " . $errosAux . "<br>";
            } finally {
                $conexao = null;
            }
            break;
        case "editar":
            try {
                $errosAux = "";

                $registro = new stdClass();
                $registro = json_decode($_POST['registro']);
                validaDados($registro);

                $sql = "update favorecido set nome = ? where id = ? ";
                $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                $pre = $conexao->prepare($sql);
                $pre->execute(array(
                    $registro->descricao_favorecido,
                    $registro->id_favorecido
                ));
                print json_encode(1);
            } catch (Exception $e) {
                foreach ($_SESSION["erros"] as $chave => $valor) {
                    $errosAux .= $valor . "<br>";
                }
                $errosAux .= $e->getMessage();
                unset($_SESSION["erros"]);
                echo "Erro: " . $errosAux . "<br>";
            } finally {
                $conexao = null;
            }
            break;
        case "excluir":
            try {
                $registro = new stdClass();
                $registro = json_decode($_POST["registro"]);

                $select = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                $pro = $select->prepare('SELECT * FROM conta_receber WHERE favorecido = ?');
                $pro->execute(array(
                    $registro->id
                ));

                if (!$pro->rowCount() > 0) {
                    $select = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                    $pra = $select->prepare('SELECT * FROM conta_pagar WHERE favorecido = ?');
                    $pra->execute(array(
                        $registro->id
                    ));
                    if(!$pra->rowCount() > 0){
                        $sql = "delete from favorecido where id = ? ";
                        $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                        $pre = $conexao->prepare($sql);
                        $pre->execute(array(
                            $registro->id
                        ));

                        print json_decode(1);
                    }else{
                        echo "Erro: Este favorecido está sendo utilizado em alguma conta sua em contas a pagar!! exclua sua conta a pagar antes de excluir ele. <br>";
                    }
                }
                else{
                    echo "Erro: Este favorecido está sendo utilizado em alguma conta sua em contas a receber!! exclua sua conta a receber antes de excluir ele. <br>";
                }
            } catch (Exception $e) {
                echo "Erro: " . $e->getMessage() . "<br>";
            } finally {
                $conexao = null;
            }
            break;
        case 'buscar':
            try {
                $registro = new stdClass();
                $registro = json_decode($_POST["registro"]);

                $sql = "select * from favorecido where id = ?";
                $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
                $pre = $conexao->prepare($sql);
                $pre->execute(array(
                    $registro->id
                ));

                print json_encode($pre->fetchAll(PDO::FETCH_ASSOC));
            } catch (Exception $e) {
                echo "Erro: " . $e->getMessage() . "<br>";
            } finally {
                $conexao = null;
            }
            break;
        default:
            print json_encode(0);
            return;
    }
}

//consulta sem ajax
function buscarfavorecido(int $id)
{
    try {
        $sql = "select * from favorecido where id = ?";
        $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
        $pre = $conexao->prepare($sql);
        $pre->execute(array(
            $id
        ));

        return $pre->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "Erro: " . $e->getMessage() . "<br>";
    } finally {
        $conexao = null;
    }
}

function listarFavorecido()
{
    try {
        $usuario_id = isset($_SESSION["usuario_id"]) ? $_SESSION["usuario_id"] : 0;

        $sql = "select * from favorecido where usuario_id = ? order by nome";
        $conexao = new PDO("mysql:host=" . SERVIDOR . ";dbname=" . BANCO, USUARIO, SENHA);
        $pre = $conexao->prepare($sql);
        $pre->execute(array(
            $usuario_id
        ));
        $pre->execute();

        return $pre->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "Erro: " . $e->getMessage() . "<br>";
    } finally {
        $conexao = null;
    }
}