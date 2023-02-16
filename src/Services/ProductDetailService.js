import {ProductDetail} from "../Entities/ProductDetail";

export class ProductDetailService {
    /**
     * @returns {Promise<ProductDetail | null>}
     */
    async getProductById(productId) {
        const lastCall = localStorage.getItem(`getProductById.${productId}.lastCall`)
        const hour = 60 /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */

        if ((Date.now() - lastCall) > hour) {
            const response = await fetch(`https://itx-frontend-test.onrender.com/api/product/${productId}`)

            if (response.ok) {
                localStorage.setItem(`getProductById.${productId}.lastCall`, Date.now())
                localStorage.setItem(
                    `getProductById.${productId}.rawProductDetail`,
                    JSON.stringify(await response.json())
                )
            }
        }

        const rawProductDetail = JSON.parse(
            localStorage.getItem(`getProductById.${productId}.rawProductDetail`) ?? 'null'
        )

        if (!rawProductDetail) {
            return null
        }

        return new ProductDetail(
            rawProductDetail.id,
            rawProductDetail.brand,
            rawProductDetail.model,
            rawProductDetail.price,
            rawProductDetail.cpu,
            rawProductDetail.ram,
            rawProductDetail.os,
            rawProductDetail.displayResolution,
            rawProductDetail.battery,
            [rawProductDetail.primaryCamera].flat().join(' '),
            [rawProductDetail.secondaryCmera].flat().join(' '), // NOTE: There is a typo on the API response
            rawProductDetail.dimensions,
            rawProductDetail.weight,
            [],// TODO: rawProductDetail.storages,
            [],// TODO: rawProductDetail.colors,
            rawProductDetail.imgUrl
        )
    }
}