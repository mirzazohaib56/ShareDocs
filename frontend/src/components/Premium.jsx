import { useState } from "react";
import { Check, Star, Zap, Crown } from "lucide-react";

// Styled Components
const PageContainer = ({ children }) => (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "60px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }}>
    {children}
  </div>
);

const Container = ({ children }) => (
  <div style={{
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center"
  }}>
    {children}
  </div>
);

const Header = ({ children }) => (
  <div style={{
    marginBottom: "50px"
  }}>
    {children}
  </div>
);

const Title = ({ children }) => (
  <h1 style={{
    fontSize: "48px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "15px",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)"
  }}>
    {children}
  </h1>
);

const Subtitle = ({ children }) => (
  <p style={{
    fontSize: "18px",
    color: "#e0e7ff",
    margin: "0",
    fontWeight: "400"
  }}>
    {children}
  </p>
);

const PlansGrid = ({ children }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    alignItems: "stretch"
  }}>
    {children}
  </div>
);

const PlanCard = ({ color, isHovered, isFeatured, onMouseEnter, onMouseLeave, children }) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      background: "#ffffff",
      borderRadius: "20px",
      padding: isFeatured ? "40px 30px" : "35px 30px",
      boxShadow: isHovered 
        ? "0 20px 60px rgba(0,0,0,0.3)" 
        : "0 10px 30px rgba(0,0,0,0.15)",
      transform: isHovered ? "translateY(-10px) scale(1.02)" : isFeatured ? "scale(1.05)" : "translateY(0) scale(1)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      border: isFeatured ? "3px solid #fbbf24" : "none"
    }}
  >
    {children}
  </div>
);

const Badge = ({ children, color = "#fbbf24" }) => (
  <div style={{
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: color,
    color: "#000",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)",
    letterSpacing: "0.5px"
  }}>
    {children}
  </div>
);

const IconWrapper = ({ children, gradient }) => (
  <div style={{
    width: "80px",
    height: "80px",
    background: gradient,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
  }}>
    {children}
  </div>
);

const PlanTitle = ({ children }) => (
  <h2 style={{
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a202c",
    margin: "0 0 10px 0"
  }}>
    {children}
  </h2>
);

const PlanDuration = ({ children }) => (
  <p style={{
    fontSize: "15px",
    color: "#718096",
    margin: "0 0 20px 0",
    fontWeight: "500"
  }}>
    {children}
  </p>
);

const PriceWrapper = ({ children }) => (
  <div style={{
    margin: "25px 0"
  }}>
    {children}
  </div>
);

const Price = ({ children }) => (
  <div style={{
    fontSize: "52px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: "1"
  }}>
    {children}
  </div>
);

const PriceLabel = ({ children }) => (
  <p style={{
    fontSize: "14px",
    color: "#a0aec0",
    margin: "8px 0 0 0"
  }}>
    {children}
  </p>
);

const Divider = () => (
  <div style={{
    height: "1px",
    background: "linear-gradient(to right, transparent, #e2e8f0, transparent)",
    margin: "25px 0"
  }} />
);

const FeaturesList = ({ children }) => (
  <ul style={{
    listStyle: "none",
    padding: "0",
    margin: "25px 0",
    textAlign: "left"
  }}>
    {children}
  </ul>
);

const FeatureItem = ({ children }) => (
  <li style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 0",
    fontSize: "14px",
    color: "#4a5568"
  }}>
    <div style={{
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #10b981, #059669)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}>
      <Check size={14} color="#ffffff" strokeWidth={3} />
    </div>
    {children}
  </li>
);

const Button = ({ isHovered, isFeatured, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      padding: "16px",
      background: isFeatured
        ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
        : "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: isHovered 
        ? "0 10px 25px rgba(102, 126, 234, 0.5)"
        : "0 4px 15px rgba(102, 126, 234, 0.3)",
      transform: isHovered ? "scale(1.05)" : "scale(1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }}
  >
    {children}
  </button>
);

// Main Component
export default function Premium() {
  const plans = [
    { 
      name: "Basic", 
      duration: "7 Days Access", 
      price: "$4.99",
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      icon: <Star size={36} color="#ffffff" />,
      features: ["Access to basic features", "Email support", "7-day access", "Single device"]
    },
    { 
      name: "Standard", 
      duration: "30 Days Access", 
      price: "$9.99",
      gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
      icon: <Zap size={36} color="#ffffff" />,
      featured: true,
      features: ["All basic features", "Priority email support", "30-day access", "Up to 3 devices", "HD quality"]
    },
    { 
      name: "Premium", 
      duration: "90 Days Access", 
      price: "$19.99",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      icon: <Crown size={36} color="#ffffff" />,
      features: ["All standard features", "24/7 premium support", "90-day access", "Unlimited devices", "4K quality", "Offline mode"]
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleSelectPlan = (planName) => {
    alert(`You selected the ${planName} plan!`);
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Choose Your Perfect Plan</Title>
          <Subtitle>Unlock premium features and take your experience to the next level</Subtitle>
        </Header>

        <PlansGrid>
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              color={plan.gradient}
              isHovered={hoveredIndex === index}
              isFeatured={plan.featured}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {plan.featured && <Badge>Most Popular</Badge>}
              
              <IconWrapper gradient={plan.gradient}>
                {plan.icon}
              </IconWrapper>

              <PlanTitle>{plan.name}</PlanTitle>
              <PlanDuration>{plan.duration}</PlanDuration>

              <PriceWrapper>
                <Price>{plan.price}</Price>
                <PriceLabel>per period</PriceLabel>
              </PriceWrapper>

              <Divider />

              <FeaturesList>
                {plan.features.map((feature, i) => (
                  <FeatureItem key={i}>{feature}</FeatureItem>
                ))}
              </FeaturesList>

              <Button
                isHovered={hoveredIndex === index}
                isFeatured={plan.featured}
                onClick={() => handleSelectPlan(plan.name)}
              >
                Choose {plan.name}
              </Button>
            </PlanCard>
          ))}
        </PlansGrid>
      </Container>
    </PageContainer>
  );
}