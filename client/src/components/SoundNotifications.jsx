import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const SoundNotifications = () => {
  const { state } = useChat();
  const audioContextRef = useRef(null);
  const lastNotificationRef = useRef(null);

  useEffect(() => {
    // Initialize audio context
    if (window.AudioContext || window.webkitAudioContext) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    // Play sound for new notifications
    if (state.notifications.length > 0) {
      const latestNotification = state.notifications[state.notifications.length - 1];
      
      // Only play sound for new notifications (not repeated)
      if (lastNotificationRef.current !== latestNotification.id) {
        playNotificationSound(latestNotification.type);
        lastNotificationRef.current = latestNotification.id;
      }
    }
  }, [state.notifications]);

  const playNotificationSound = (type) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Resume audio context if it's suspended (browser policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sounds for different notification types
      const soundConfig = getSoundConfig(type);
      
      oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
      oscillator.type = soundConfig.waveType;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(soundConfig.volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + soundConfig.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + soundConfig.duration);

      // Chain multiple tones for some notification types
      if (soundConfig.chain) {
        setTimeout(() => {
          playChainedSound(soundConfig.chain);
        }, soundConfig.duration * 1000);
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const playChainedSound = (chainConfig) => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(chainConfig.frequency, audioContext.currentTime);
    oscillator.type = chainConfig.waveType;

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(chainConfig.volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + chainConfig.duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + chainConfig.duration);
  };

  const getSoundConfig = (type) => {
    switch (type) {
      case 'message':
        return {
          frequency: 800,
          waveType: 'sine',
          volume: 0.1,
          duration: 0.2,
          chain: {
            frequency: 1000,
            waveType: 'sine',
            volume: 0.08,
            duration: 0.15
          }
        };
      case 'private_message':
        return {
          frequency: 1200,
          waveType: 'triangle',
          volume: 0.12,
          duration: 0.3,
          chain: {
            frequency: 1000,
            waveType: 'triangle',
            volume: 0.1,
            duration: 0.2
          }
        };
      case 'user_joined':
        return {
          frequency: 600,
          waveType: 'square',
          volume: 0.08,
          duration: 0.4
        };
      case 'user_left':
        return {
          frequency: 400,
          waveType: 'square',
          volume: 0.06,
          duration: 0.3
        };
      default:
        return {
          frequency: 750,
          waveType: 'sine',
          volume: 0.1,
          duration: 0.2
        };
    }
  };

  // This component doesn't render anything
  return null;
};

export default SoundNotifications;
