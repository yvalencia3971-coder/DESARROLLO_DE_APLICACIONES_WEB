//Diseño visual de la calculadora
// Obtener la pantalla de la calculadora
const pantalla = document.getElementById("pantalla");

// Variable que almacena la operación
let operacion = "";

// Función para agregar números y operadores
function agregar(valor) {

    // Si la pantalla muestra cero al inicio, lo reemplazamos
    if (operacion === "" && valor !== ".") {
        operacion = valor;
    } else {
        operacion += valor;
    }

    // Mostrar la operación en pantalla
    pantalla.value = operacion.replace(/\*/g, "×").replace(/\//g, "÷");
}

// Función para limpiar toda la operación
function limpiar() {

    operacion = "";
    pantalla.value = "0";

}

// Función para borrar el último carácter
function borrar() {

    operacion = operacion.slice(0, -1);

    pantalla.value = operacion
        ? operacion.replace(/\*/g, "×").replace(/\//g, "÷")
        : "0";

}

// Función para calcular el resultado
function calcular() {

    try {

        // Separar los números y operadores
        const numeros = operacion.match(/(\d+\.?\d*|\.\d+|[+\-*/])/g);

        // Verificar que la expresión sea válida
        if (!numeros || numeros.join("") !== operacion) {
            throw new Error("Operación inválida");
        }

        let posicion = 0;

        // Leer un número o una operación con signo
        function leerNumero() {

            let signo = 1;

            if (numeros[posicion] === "-") {
                signo = -1;
                posicion++;
            } else if (numeros[posicion] === "+") {
                posicion++;
            }

            const valor = Number(numeros[posicion]);

            if (
                numeros[posicion] === undefined ||
                !Number.isFinite(valor)
            ) {
                throw new Error("Número inválido");
            }

            posicion++;

            return signo * valor;
        }

        // Resolver multiplicaciones y divisiones
        function leerTermino() {

            let resultado = leerNumero();

            while (
                numeros[posicion] === "*" ||
                numeros[posicion] === "/"
            ) {

                const operador = numeros[posicion];
                posicion++;

                const siguiente = leerNumero();

                if (operador === "*") {
                    resultado *= siguiente;
                } else {

                    if (siguiente === 0) {
                        throw new Error("No se puede dividir para cero");
                    }

                    resultado /= siguiente;
                }
            }

            return resultado;
        }

        // Resolver sumas y restas
        function leerExpresion() {

            let resultado = leerTermino();

            while (
                numeros[posicion] === "+" ||
                numeros[posicion] === "-"
            ) {

                const operador = numeros[posicion];
                posicion++;

                const siguiente = leerTermino();

                if (operador === "+") {
                    resultado += siguiente;
                } else {
                    resultado -= siguiente;
                }
            }

            return resultado;
        }

        // Obtener el resultado final
        const resultado = leerExpresion();

        // Comprobar que no queden caracteres pendientes
        if (posicion !== numeros.length || !Number.isFinite(resultado)) {
            throw new Error("Operación inválida");
        }

        // Mostrar el resultado
        operacion = String(Number(resultado.toPrecision(12)));
        pantalla.value = operacion;

    } catch (error) {

        // Mostrar un mensaje cuando existe un error
        pantalla.value = "Error";
        operacion = "";

    }

}

