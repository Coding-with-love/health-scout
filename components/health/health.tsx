import Image from "next/image";
const HealthSection = ({
    ingredients,
    
  }: {
    ingredients: string;
    
  }) => {
    ingredients = ingredients ?? 'N/A';
    return (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Health</h2>
        <section>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Ingredients</h3>
          <p>{ingredients}</p>
          {/* Placeholder image */}
          <Image src="your-image-url.jpg" alt="Ingredients label" style={{ maxWidth: '100px', marginBottom: '1rem' }} />
        </section>
        </div>
    );
  };
  
  export default HealthSection;
  