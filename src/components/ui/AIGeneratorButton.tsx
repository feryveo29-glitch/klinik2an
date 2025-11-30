import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './button';
import { aiService } from '../../services/ai.service';

interface AIGeneratorButtonProps {
    onGenerate: (data: any) => void;
    mode: 'patient' | 'medical-record';
    contextData?: any; // Data tambahan untuk context (misal info pasien untuk generate rekam medis)
    className?: string;
}

export const AIGeneratorButton: React.FC<AIGeneratorButtonProps> = ({
    onGenerate,
    mode,
    contextData,
    className
}) => {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!aiService.isAvailable()) {
            alert('API Key Gemini belum diset! Silakan cek file .env');
            return;
        }

        setLoading(true);
        try {
            let data;
            if (mode === 'patient') {
                data = await aiService.generatePatientData();
            } else {
                if (!contextData) {
                    alert('Data pasien diperlukan untuk generate rekam medis');
                    return;
                }
                data = await aiService.generateMedicalRecord(contextData);
            }

            onGenerate(data);
        } catch (error) {
            console.error('Gagal generate data:', error);
            alert('Gagal generate data AI. Cek console untuk detail.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                disabled={loading}
                className={`gap-2 border-purple-200 hover:bg-purple-50 text-purple-700 ${className}`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Sparkles className="w-4 h-4" />
                )}
                {loading ? 'Generating...' : 'Isi Otomatis (AI)'}
            </Button>

            {/* Tombol Debug Tersembunyi (Klik kanan atas tombol untuk cek model) */}
            <div
                className="w-3 h-3 bg-transparent absolute top-0 right-0 cursor-help z-50"
                title="Klik untuk Cek Model AI"
                onClick={(e) => {
                    e.stopPropagation();
                    aiService.debugModels();
                }}
            />
        </div>
    );
};
