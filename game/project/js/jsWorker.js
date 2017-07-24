
var context;
var field;
var steps;

function makeField() {
	
	var canvas = document.getElementById("mainField"); // хватаем тэг канвас в одноименную перменную
	canvas.width  = 320; // задаем тэгу высоту и ширину
	canvas.height = 320;
	var cellSize = canvas.width / 4; // определяем высоту одной ячейки
	context = canvas.getContext("2d"); 
	
	canvas.onclick = function(e) { // обрабатываем клики мышью
		var x = (e.pageX - canvas.offsetLeft) / (320/4) | 0;
		var y = (e.pageY - canvas.offsetTop)  / (320/4) | 0;
		event(x, y); // вызов функции действия
	}
	 
	field = new Game();// создаём объект пятнашек
	field.mix(Math.floor(Math.random()*100)); // перемешиваем содердимое полотна
	
	field.setCellView(// задаём внешний вид пятнашек(ячеек)
		function(x, y) { 
		    context.fillStyle = "#15a642";
		    context.fillRect(x+1, y+1, cellSize-2, cellSize-2);
		}
	);
	
	field.setNumView(// параметры шрифта для цифр
		function() { 
	    	context.font = "bold "+(cellSize/2)+"px Sans";
	    	context.textAlign = "center";
	    	context.textBaseline = "middle";
	    	context.fillStyle = "#222";
	    }
	);
	context.fillStyle = "#222";
	context.fillRect(0, 0, canvas.width, canvas.height);
	field.draw(context, cellSize);
}


function Game() {
	var cellView = null;
	var numView = null;
	var arr = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
	
	
	function getEmptyCell() { // функция возвращает координату пустой клетки
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (arr[j][i] === 0) {
					return{"x":i,"y":j};
				}
			}
		}
	};
	
	function getRandomBool() {// функция возвращает произвольное логическое значение
		if (Math.floor(Math.random() * 2) === 0) {
			return true;
		}
	}
	
	

	this.move = function(x, y) {// метод перемещает "пятнашку" в пустую клeтку 
		var emptyCell = getEmptyCell();
		var nullX = emptyCell.x;
		var nullY = emptyCell.y;
		if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
			arr[nullY][nullX] = arr[y][x];
			arr[y][x] = 0;
			steps++;
			document.querySelector('#steps').innerHTML = 'Your steps... ' + steps;
		}
	};
	
	this.isVictory = function() {// проверка условия победы
		var e = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0]];
		var res = true;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (e[i][j] != arr[i][j]) {
					res = false;
					break;
					break;
				}
			}
		}
	return res;
	};
	
	this.mix = function(stepCount) {// метод "перемешивает" пятнашки
		var x,y;
		for (var i = 0; i < stepCount; i++) {
			var nullX = getEmptyCell().x;
			var nullY = getEmptyCell().y;
			var hMove = getRandomBool();
			var upLeft = getRandomBool();
			if (!hMove && !upLeft) { y = nullY; x = nullX - 1;}
			if (hMove && !upLeft)  { x = nullX; y = nullY + 1;}
			if (!hMove && upLeft)  { y = nullY; x = nullX + 1;}
			if (hMove && upLeft)   { x = nullX; y = nullY - 1;}
			if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
				this.move(x, y);
				steps = 0;
				document.querySelector('#steps').innerHTML = 'Your steps... 0' ;
			}
		}
	};
	
	this.setCellView = function(func) {// внешний вид пятнашки
		cellView = func;
	};
	
	this.setNumView = function(func) {// параметры шрифта цифр
		numView = func;
	};
	
	this.draw = function(context, size) {// Метод рисующий пятнашки на холсте
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (arr[i][j] > 0) {
					if (cellView !== null) {
						cellView(j * size, i * size);
					}
					if (numView !== null) {
						numView();
						context.fillText(arr[i][j], j * size + size / 2, i * size + size / 2);
					}
				}
			}
		}
	}
}


function event(x, y) { // функция производит необходимые действие при клике(касанию)
	field.move(x, y);
	context.fillStyle = "#222";
	context.fillRect(0, 0, 320, 320);
	field.draw(context, 320/4);
	if (field.isVictory()) { // если головоломка сложена, то пятнашки заново перемешиваются
		alert( 'Congatulations! You are Won! Your score is ' + steps +' steps!'); // вывод сообщения о выигрыше!!; 
		field.mix(300);
		context.fillStyle = "#222";
		context.fillRect(0, 0, 320, 320);
		field.draw(context, 320/4);
	}
}

