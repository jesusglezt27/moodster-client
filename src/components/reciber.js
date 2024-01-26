import { useNavigate } from 'react-router-dom';

const Reciber = () => {
    const navigate = useNavigate();

    // Función para manejar el clic en el botón
    const handleNavigate = () => {
        navigate('/dashboard'); // Esto redirige al usuario a '/dashboard'
    };

    return (
        <div>
            {/* Botón que, cuando se hace clic, llama a handleNavigate */}
            <button onClick={handleNavigate}>Ir al Dashboard</button>
        </div>
    );
};

export default Reciber;
