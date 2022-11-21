import { Link } from "react-router-dom"

export default function ItemDisplayPanel({ item, id }) {
    return (
        <Link className="item-container" to={`${item.id}`}>
            <h3 className="product-title">{item.title}</h3>
            <div className="img-container-card">
                <img src={require(`../img/item-${id + 1}-mockup.jpg`)}></img>
            </div>
            <div className="price-label"><span>$</span>{item.price}</div>
        </Link>
    )
}