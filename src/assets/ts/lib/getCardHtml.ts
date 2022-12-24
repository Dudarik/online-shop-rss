import { GoodsItem } from '../../interfaces';
import { checkElem } from '../helpers/checkers';
import { isGoodsItemInCart } from './cartFunctions';
import { handlerAddToCartClick } from './handlers';

export async function getCardHtml(cardData: GoodsItem, options?: Record<string, string>) {
    const tplToRender = 'goodsCardTpl.html';

    const CARD_IDS = ['gc_title', 'gc_description', 'gc_price', 'gc_rating', 'gc_stock', 'gc_brand', 'gc_category'];

    const card = await fetch(tplToRender)
        .then((response) => response.text())
        .then((text) => {
            const domParcer = new DOMParser();
            const html = domParcer.parseFromString(text, 'text/html');
            return checkElem(html.querySelector('#goods_card'));
        });
    console.log(options);

    if (card) {
        card.dataset.goodsId = String(cardData.id);
        const img = checkElem(card).querySelector('#gc_image');
        if (img instanceof HTMLImageElement) {
            img.setAttribute('src', cardData.images[0]);
            img.setAttribute('alt', cardData.title);
        }

        CARD_IDS.forEach((item) => {
            checkElem(card.querySelector(`#${item}`)).innerText = String(cardData[item.slice(3)]);
        });
    }

    const btnAddToCart = checkElem(card.querySelector('#btn_add_to_cart'));

    const goodsItemInCart = isGoodsItemInCart(cardData.id);

    btnAddToCart.dataset.btnTitle = goodsItemInCart ? 'Удалить из корзины' : 'Добавить в корзину';

    if (goodsItemInCart) btnAddToCart.classList.add('in-cart');

    btnAddToCart.addEventListener('click', handlerAddToCartClick);

    return card;
}
