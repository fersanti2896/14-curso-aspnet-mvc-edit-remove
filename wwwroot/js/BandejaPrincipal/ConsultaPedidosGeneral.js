
function AgregarPedido(PedidoId) {
	ConsultaDetallePedido(PedidoId);
}

/* Para manejo de vista parcial */
function ConsultaDetallePedido(PedidoId) {
	$("#PedidoId").val(PedidoId);

	var modelo = { PedidoId: PedidoId };
	envioGenericos("/ConsultaInformacion/ConsultaDetallePedido", modelo, EdicionPedido);
}

/* Muestra un modal en el HTML parcial de ConsultaDetallePedido */
function EdicionPedido(html) {
	var pedido = parseInt($("#PedidoId").val());
	var title  = pedido == 0 ? "Nuevo Pedido" : "<strong>Edición del Pedido <u>" + pedido + "</u></strong>";
	var cerrar = false;

	Swal.fire({
		title: title,
		html: html,
		heightAuto: false,
		width: 1200,
		showCloseButton: true,
		showCancelButton: true,
		focusConfirm: false,
		closeModal: false,
		didOpen() {
			/* Se renderiza los productos y estados y se necesita que esté abierta */
			var modelo = {};

			envioGenericos("/ConsultaInformacion/ConsultaProductos", modelo, RenderizaProductos);
			envioGenericos("/ConsultaInformacion/ConsultaEstadosRepublica", modelo, RenderizaEstadosRepublica);

			$("#SelectProducto").on('change', function () {
				var imagen = $("#SelectProducto option:selected").text();
				$("#ImagenProducto").attr("src", "/images/" + imagen + ".jpg");
			});

			ConsultaDetallesDelPedido();

			Swal.keepOpened = true;
		},
		preConfirm: function (resultado) {
			/* Comportamiento detonadas por el botón confirmar */
			return cerrar;
		},
		confirmButtonText: '<i class="far fa-save"></i> Guardar',
		cancelButtonText: '<i class="far fa-eraser"></i> Cerrar'
	})
}

function ActualizarEstadoPedido(PedidoId, EstadoSiguienteId) {
	var modelo = { PedidoId: PedidoId, CatEstadoPedidoId: EstadoSiguienteId }
	envioGenericos("/ConsultaInformacion/ActualizarEstadoPedido", modelo, ConsultaGrid);
}

function EliminarPedido(PedidoId) {
	var modelo = { PedidoId: PedidoId }
	envioGenericos("/ConsultaInformacion/EliminarPedido", modelo, ConsultaGrid);
}

function RenderizaProductos(jsonResult) {
	var opciones = RenderizaResultado(jsonResult);

	$("#SelectProducto").html(opciones);
}

function RenderizaEstadosRepublica(jsonResult) {
	var opciones = RenderizaResultado(jsonResult);

	$("#SelectEstadosRepublica").html(opciones);
}

function RenderizaResultado(dataJSON) {
	var select = "<option value='0'>SIN SELECCION</option>";

	for (var indice in dataJSON) {
		var llave = dataJSON[indice].key;
		var valor = dataJSON[indice].value;

		select += "<option value='"+ llave + "'>" + valor + "</option>"
	}

	return select;
}

function ConsultaDetallesDelPedido() {
	var modelo = { PedidoId: $("#PedidoId").val() }

	envioGenericos("/ConsultaInformacion/ConsultaDetallesDelPedido", modelo, "TablaDetallePedido")
}