import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff, User, Mail, Phone, Lock, Camera } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { uploadUserPhoto } from '../../utils/photoUpload';
import CosmicBackground from '../3D/CosmicBackground';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().optional(),
  age: yup.number().min(13, 'Must be at least 13 years old').max(100, 'Invalid age').optional(),
  interests: yup.string().optional(),
  about: yup.string().optional(),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and privacy policy')
});

interface FormData {
  fullName: string;
  email: string;
  phone?: string;
  age?: number;
  interests?: string;
  about?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  const { signup, loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const password = watch('password', '');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let photoURL = '';
      
      if (photoFile) {
        photoURL = await uploadUserPhoto(photoFile, data.email);
      }

      await signup(data.email, data.password, {
        displayName: data.fullName,
        phone: data.phone,
        age: data.age,
        interests: data.interests,
        about: data.about,
        photoURL
      });

      navigate('/dashboard'); // Redirect after successful signup
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard'); // Redirect after Google signup
    } catch (error: any) {
      console.error('Google signup error:', error);
      alert(error.message || 'Google signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const interests = [
    'Technology', 'Arts', 'Sports', 'Music', 'Reading', 
    'Travel', 'Gaming', 'Science', 'Nature', 'Cooking'
  ];

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">Join Your Mental Guardian</h1>
              <p className="text-white/70">Begin your personalized healing journey today</p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-black/50 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white/50" />
                    )}
                  </div>
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-white/80 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input {...register('fullName')} type="text" placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-white/80 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input {...register('email')} type="email" placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </motion.div>
            </div>

            {/* Phone & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-white/80 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input {...register('phone')} type="tel" placeholder="Enter your phone number"
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <label className="block text-white/80 mb-2">Age</label>
                <input {...register('age')} type="number" min="13" max="100" placeholder="Enter your age"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
              </motion.div>
            </div>

            {/* Interests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <label className="block text-white/80 mb-2">Field of Interest</label>
              <select {...register('interests')}
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="">Select your interests</option>
                {interests.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </motion.div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <label className="block text-white/80 mb-2">About Yourself</label>
              <textarea {...register('about')} rows={3} placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
              <label className="block text-white/80 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                  className="w-full pl-11 pr-11 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {password && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60">
                    {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <label className="block text-white/80 mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input {...register('confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password"
                  className="w-full pl-11 pr-11 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </motion.div>

            {/* Terms */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex items-start space-x-3">
              <input {...register('acceptTerms')} type="checkbox" className="mt-1 w-4 h-4 text-cyan-400 bg-white/10 border border-white/20 rounded focus:ring-cyan-400" />
              <label className="text-white/80 text-sm">
                I accept the{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">Privacy Policy</a> and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">Terms of Service</a>
              </label>
            </motion.div>
            {errors.acceptTerms && <p className="text-red-400 text-sm">{errors.acceptTerms.message}</p>}

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="space-y-4">
              <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : 'Create Account'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/30 text-white/60">Or continue with</span>
                </div>
              </div>

              <button type="button" onClick={handleGoogleSignup} disabled={isLoading} className="w-full py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                <FcGoogle className="w-5 h-5" />
                <span>Sign up with Google</span>
              </button>
            </motion.div>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-center text-white/60 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-cyan-400 hover:text-cyan-300 underline">Sign in here</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
