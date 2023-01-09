import { goods } from '../goods/goodsArray';
import { store } from '../store';
import { handlerButtonClick } from './handlers';
import { renderCart } from './renderCart';

export function displayShowListPagination(arrGoods: string[], goodsOnPage: number, page: number) {
    const cartList = document.querySelector('#cart-goods') as HTMLElement;
    const numElemPagination = document.getElementById('num_elems_pagination') as HTMLInputElement;
    const numPageElem = document.getElementById('current-page') as HTMLElement;

    let showNumber;
    if (goodsOnPage === null) {
        goodsOnPage = goods.length;
        showNumber = '';
    } else {
        showNumber = goodsOnPage;
    }

    if (!page) {
        page = 0;
    }

    localStorage.setItem('pageNumber', JSON.stringify(page));

    numElemPagination.value = showNumber.toString();
    cartList.innerHTML = '';

    const start = Number(goodsOnPage) * page;
    const end = start + Number(goodsOnPage);

    numPageElem.textContent = `${page + 1}`;
    const arrVisibleOnPage = arrGoods.slice(start, end);
    const maxNumberPage = Math.ceil(arrGoods.length / goodsOnPage);

    if (arrVisibleOnPage.length === 0 && arrGoods.length !== 0 ) {
        let checkPage = JSON.parse(localStorage.getItem('pageNumber') as string);
        checkPage -= 1;
        localStorage.setItem('pageNumber', JSON.stringify(checkPage));
        renderCart();
    }

    localStorage.setItem('maxNumberPage', JSON.stringify(maxNumberPage));

    arrVisibleOnPage.forEach((el) => {
        getCreatedGoodsElement(el);
    });
}

function getCreatedGoodsElement(el: string) {
    const cartList = document.querySelector('#cart-goods') as HTMLElement;
    const goodsElem = goods.find((elem) => elem.id === Number(el));
    if (goodsElem !== undefined) {
        const cartElem = document.createElement('div') as HTMLElement;
        cartElem.className = 'cart__container';

        const cartImgContainer = document.createElement('div') as HTMLElement;
        cartImgContainer.className = 'cart__img_container';
        const cartImg = document.createElement('img') as HTMLImageElement;
        cartImg.className = 'cart__img';
        cartImg.src = `${goodsElem.images[0]}`;
        cartImgContainer.append(cartImg);

        const anchorCartTitle = document.createElement('a');
        anchorCartTitle.href = `/goods/${goodsElem.id}`;
        anchorCartTitle.classList.add('cart__title');
        anchorCartTitle.innerText = goodsElem.title;

        const cartPrice = document.createElement('div') as HTMLElement;
        cartPrice.className = 'cart__price';
        cartPrice.textContent = `Цена: ${goodsElem.price} ₽`;

        const cartStock = document.createElement('div') as HTMLElement;
        cartStock.className = 'cart__stock';
        cartStock.textContent = `Остаток товара: ${goodsElem.stock} шт.`;

        const cartButtons = document.createElement('div') as HTMLElement;
        cartButtons.className = 'cart-button__container';

        const buttonMinus = document.createElement('button') as HTMLElement;
        buttonMinus.classList.add('minusOneitemBtn');
        buttonMinus.dataset.goodsId = el;
        buttonMinus.dataset.maxCount = goodsElem.stock.toString();
        buttonMinus.addEventListener('click', handlerButtonClick);

        const buttonCounter = document.createElement('div') as HTMLElement;
        buttonCounter.classList.add('counterNum');
        buttonCounter.textContent = `${store.cart[el]}`;

        const buttonPlus = document.createElement('button') as HTMLElement;
        buttonPlus.classList.add('plusOneitemBtn');
        buttonPlus.dataset.typeButton = '+';
        buttonPlus.dataset.goodsId = el;
        buttonPlus.dataset.maxCount = goodsElem.stock.toString();
        buttonPlus.addEventListener('click', handlerButtonClick);

        cartButtons.append(buttonMinus);
        cartButtons.append(buttonCounter);
        cartButtons.append(buttonPlus);
        cartElem.append(cartPrice);
        cartElem.append(cartImgContainer);
        cartElem.append(anchorCartTitle);
        cartElem.append(cartStock);
        cartElem.append(cartButtons);
        cartList.append(cartElem);
    }
}
