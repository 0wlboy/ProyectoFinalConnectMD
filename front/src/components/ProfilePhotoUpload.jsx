import { useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User } from 'lucide-react';

const ProfilePhotoUpload = ({onPhotoUpload}) => {
  const [photoURL, setPhotoURL] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setPhotoURL(url);
        onPhotoUpload(file); // Pasar el objeto File al padre
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="w-24 h-24 cursor-pointer" onClick={triggerFileInput}>
        {photoURL ? (
          <AvatarImage src={photoURL} alt="Foto de perfil" />
        ) : (
          <AvatarFallback className="bg-blue-100 text-blue-800">
            <User className="h-12 w-12" />
          </AvatarFallback>
        )}
      </Avatar>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="text-[#00bcd4] border-[#00bcd4] hover:bg-blue-50"
        onClick={triggerFileInput}
      >
        Agregar una foto de perfil
      </Button>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload} 
      />
    </div>
  );
};

export default ProfilePhotoUpload;