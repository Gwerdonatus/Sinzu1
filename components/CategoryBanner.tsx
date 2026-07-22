'use client';
import Link from 'next/link';
interface Props { title: string; subtitle?: string; link: string; showLabel?: boolean; }
export default function CategoryBanner({ title, subtitle = "Let's Go →", link, showLabel = true }: Props) {
  const words = title.split(' ');
  return (
    <Link href={link} className="block">
      <div className="category-banner-box">
        <div className="category-banner-content">
          {showLabel && <p className="category-banner-label">Shop</p>}
          <h3 className="category-banner-title">
            {words.map((word, i) => {
              const isGold = ['2','PIECE','WAISTBEADS','SWIMSUITS','LOUNGEWEAR','SALE'].includes(word.toUpperCase().replace(/[^A-Z0-9]/g,''));
              return <span key={i} className={isGold ? 'gold-letter' : ''}>{word}{i < words.length - 1 ? ' ' : ''}</span>;
            })}
          </h3>
          <div className="category-banner-btn">{subtitle}</div>
        </div>
      </div>
      <div className="category-banner-link">
        {title.includes('Male') ? 'Male' : title.includes('2 piece') ? '2 piece Jumpsuit Set' : title.includes('SALE') ? 'SALE' : title.includes('WAISTBEADS') ? 'Waistbeads' : title}
        <span>→</span>
      </div>
    </Link>
  );
}
