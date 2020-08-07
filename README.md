BEM-Scrollspy
=============

Блок для отслеживания прокрутки страницы. Предназначен для проектов, использующих БЭМ методологию.

## Зависимости

bem-core
  * блок `i-bem-dom` 
  * блок `next-tick`
  * блок `functions` 
  * блок `jquery`
   
## Установка

 1. Добавьте библиотеку в зависимости `package.json`:
 
 ```json
{
    "devDependencies": {
        "bem-scrollspy": "github:bem-contrib/bem-scrollspy#v0.3.0"
    }
}
```

 2. Добавьте уровень переопределения в файл `.bemrc.js`:

``` javascript
{
    root: true,
    levels: [],
    libs: {
        "bem-scrollspy": {}
    }
}
```

## Использование

Все, что делает блок `scrollspy` — генерирует два БЭМ-события:

  * `scrollin` - когда блок становится виден пользователю;
  * `scrollout` - когда блок скрывается из виду.
  
Подписавшись на эти события, можно выполнять различные действия. Например, запускать и останавливать анимацию:

````javascript
    this
        ._events(this.findMixedBlock(Scrollspy))
        .on('scrollin', function() { this.setMod('animation', 'progress'); }, this)                
        .on('scrollout', function() { this.setMod('animation', 'stop'); }, this);   
````

В объекте события передается направление прокрутки. Например:

````javascript
    this
        ._events(this.findMixedBlock(Scrollspy))
        .on('scrollin', this._onScrollIn, this); //подписка на событие
    
    function _onScrollIn(_, dir) { //получаем направление скролла вторым параметром
      if (dir === 'down') {
        doAction();
      } else if (dir === 'up') {
        doAnotherAction();
      }
    }
````

## Параметры

Можно задать отступ для блока в пикселях или процентах (по умолчанию 10% от края окна). Можно задать отступ сразу в js-параметрах блока:

````bemjson
  {
    block: 'scrollspy',
    js: { offset: 40 }
  }
````

или использовать метод `setOffset()`:

````javascript
    const ss = this.findChild(Scrollspy);
    ss.setOffset(0);
````
Этот метод установит новый размер отступа и пересчитает позицию блока.

Если вам нужно только пересчитать позицию блока, не меняя значений, можно использовать метод `calcOffsets()`.

## Методы блока

| Метод           | Описание                                            |
|-----------------|-----------------------------------------------------| 
| setOffset(val)  | Устанавливает отступ в процентах или пикселях.      |
| calcOffsets()   | Запускает расчет позиции блока.                     |
| activate()      | Ручная активация блока (вызовет событие `scrollin`).|
| deactivate()    | «Ручной» `scrollout`.                               |
| getDir()        | Возвращает последнее направление прокрутки.         |
| isActive()      | Проверяет, находится ли блок в зоне просмотра       |
