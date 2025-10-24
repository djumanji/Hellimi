import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (userData: UserData) => void;
}

export interface UserData {
  name: string;
  surname: string;
  city: string;
  dob: string;
}

export function RegisterDialog({ open, onOpenChange, onRegister }: RegisterDialogProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    surname: '',
    city: '',
    dob: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    onRegister(formData);
    
    // Reset form
    setFormData({
      name: '',
      surname: '',
      city: '',
      dob: '',
    });
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
          <DialogDescription>
            Join the community and start sharing your ideas. Fill in your details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your first name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            {/* Surname Field */}
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname *</Label>
              <Input
                id="surname"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                placeholder="Enter your last name"
                className={errors.surname ? 'border-red-500' : ''}
              />
              {errors.surname && (
                <span className="text-sm text-red-500">{errors.surname}</span>
              )}
            </div>

            {/* City Field */}
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <span className="text-sm text-red-500">{errors.city}</span>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
                className={errors.dob ? 'border-red-500' : ''}
              />
              {errors.dob && (
                <span className="text-sm text-red-500">{errors.dob}</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
