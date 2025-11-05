import React from 'react';

interface DeveloperCardProps {
  name: string;
  role: string;
  email: string;
  image: string;
  description: string;
  skills: string[];
  index: number;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({
  name,
  role,
  email,
  image,
  // description is not used in the component
  skills,
  index
}) => {
  return (
    <div 
      className="group relative overflow-hidden transition-all duration-700 hover:transform hover:scale-105 cursor-pointer"
      style={{
        animationDelay: `${index * 200}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(30px)'
      }}
    >
      <div 
        className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-mint-green/30"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF9F5 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-mint-green/5 to-sky-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
        
        {/* Profile Image */}
        <div className="relative z-10 flex justify-center mb-6">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: 'linear-gradient(135deg, #68B2C9, #8ED4BE)',
                padding: '4px'
              }}
            >
              <img 
                src={image} 
                alt={name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            {/* Floating badge */}
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-500 group-hover:scale-125"
              style={{ backgroundColor: '#68B2C9' }}
            >
              {index + 1}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Name */}
          <h3 
            className="text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-sky-blue"
            style={{ color: '#294954' }}
          >
            {name}
          </h3>
          
          {/* Role */}
          <div 
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 transition-all duration-300 group-hover:scale-105"
            style={{ 
              backgroundColor: '#8ED4BE',
              color: '#294954'
            }}
          >
            {role}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {skills.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: 'rgba(104, 178, 201, 0.1)',
                  color: '#68B2C9',
                  border: '1px solid rgba(104, 178, 201, 0.2)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Email */}
          <div className="flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-105">
            <svg 
              className="w-4 h-4" 
              style={{ color: '#68B2C9' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a 
              href={`mailto:${email}`}
              className="text-sm font-medium transition-colors duration-300 hover:text-sky-blue"
              style={{ color: '#294954' }}
            >
              {email}
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: '#68B2C9' }}></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: '#8ED4BE' }}></div>
      </div>
    </div>
  );
};

export default DeveloperCard;
