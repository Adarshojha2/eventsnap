import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Camera, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password);
      toast.success('Account created! Welcome to EventSnap 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left: Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <Camera size={28} color="#6C63FF" />
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1a1a2e' }}>Event<span style={{ color: '#6C63FF' }}>Snap</span></span>
          </Link>

          <h2 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Get started free 🚀</h2>
          <p style={{ color: '#6c757d', marginBottom: 32, fontSize: '0.95rem' }}>Create an account to host your events and share photos.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="mb-3">
              <label style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e', marginBottom: 6, display: 'block' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e', marginBottom: 6, display: 'block' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }}
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                />
              </div>
              {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e', marginBottom: 6, display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }}
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                />
              </div>
              {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e', marginBottom: 6, display: 'block' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  style={{ paddingLeft: 40, borderRadius: 10, border: '1.5px solid #e8e8f0', height: 46 }}
                  {...register('confirmPassword', { required: 'Please confirm password', validate: value => value === password || 'Passwords do not match' })}
                />
              </div>
              {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ background: loading ? '#adb5bd' : 'linear-gradient(135deg, #6C63FF, #5849e8)', color: 'white', border: 'none', borderRadius: 10, height: 48, fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s' }}
            >
              {loading ? (
                <><div className="spinner-border spinner-border-sm" role="status" /><span>Creating account...</span></>
              ) : (
                <><UserPlus size={18} /> Register</>
              )}
            </button>
          </form>

          <div className="text-center mt-4" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right: Gradient Visual */}
      <div className="d-none d-lg-flex es-gradient-hero" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 60, flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>📸</div>
        <h2 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: 16 }}>Start capturing memories!</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 320, lineHeight: 1.7 }}>
          Create events, configure galleries, download ZIP archives, and let guests upload their special snapshots easily.
        </p>
      </div>
    </div>
  );
};

export default Register;
