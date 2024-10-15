import React from 'react'
import { Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'

const MenuItem: React.FC<{ title: string; description: string; price: string; imageUrl: string }> = ({ title, description, price, imageUrl }) => (
  <div className="card menu-item" data-aos="fade-up">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-lg" loading="lazy" />
    <div className="card-body">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <span className="text-burgundy font-semibold">{price}</span>
    </div>
  </div>
)

const Menu: React.FC = () => {
  return (
    <section id="menu" className="bg-cream py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12" data-aos="fade-up">
          Menu Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MenuItem 
            title="Mixed Grill"
            description="A delicious assortment of grilled meats including lamb, chicken, and beef kebabs"
            price="£16.99"
            imageUrl="/src/assets/Mixed_grill.jpg"
          />
          <MenuItem 
            title="Mantu"
            description="Steamed dumplings filled with seasoned ground beef and onions, topped with yogurt and lentil sauce"
            price="£12.99"
            imageUrl="/src/assets/Mantu.jpg"
          />
          <MenuItem 
            title="Lamb Chops"
            description="Tender, marinated lamb chops grilled to perfection and served with Afghan-style rice"
            price="£18.99"
            imageUrl="/src/assets/Lamb_Chops.jpg"
          />
        </div>
        <div className="text-center">
          <p className="text-base text-gray-600 mb-6" data-aos="fade-up">Discover our full menu featuring a wide range of authentic Afghan dishes.</p>
          <Link to="/menu" className="btn btn-primary inline-flex items-center justify-center" data-aos="fade-up">
            <Utensils className="mr-2" size={18} />
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Menu
