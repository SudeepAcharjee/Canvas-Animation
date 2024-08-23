import type { NextPage } from 'next';
import Card from './Card';
import { FaInfoCircle, FaLightbulb } from 'react-icons/fa';


const cardData = [
    {
        icon: <FaInfoCircle size={32} />,
        title: 'Technology',
        content: 'Explore cutting-edge technologies that are shaping the future. Learn about advancements in AI, robotics, and more. Dive into the world of innovation and discover how these technologies are revolutionizing industries.',
        color: '#0f0',
    },
    {
        icon: <FaLightbulb size={32} />,
        title: 'Creative Design',
        content: 'Unleash your creativity with design principles that inspire. From modern art to user experience design, find out how aesthetics and functionality come together to create impactful visual experiences.',
        color: '#ff0',
    },
];

const CardPage: NextPage = () => {
    return (
        <div id='cards' className="flex justify-center items-center min-h-screen bg-black p-8">
            <div className="flex gap-12 flex-wrap">
                {cardData.map((data, index) => (
                    <Card
                        key={index}
                        title={data.title}
                        content={data.content}
                        color={data.color}
                        icon={data.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardPage;
