"use client"

import { cn } from "@/lib/utils"

type PetStage = "bebe" | "crianca" | "adolescente" | "adulto" | "lendario"

interface PetCreatureProps {
  stage: PetStage
  isAnimated?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function PetCreature({ stage, isAnimated = true, size = "md", className }: PetCreatureProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    xl: "w-52 h-52",
  }

  const renderBebe = () => (
    <svg viewBox="0 0 100 100" className={cn(sizeClasses[size], isAnimated && "animate-bounce", className)}>
      {/* Corpo - bolinha fofa */}
      <ellipse cx="50" cy="55" rx="30" ry="28" fill="url(#bebeGradient)" />
      
      {/* Orelhinhas */}
      <ellipse cx="30" cy="35" rx="8" ry="10" fill="#FFB347" />
      <ellipse cx="70" cy="35" rx="8" ry="10" fill="#FFB347" />
      <ellipse cx="30" cy="35" rx="5" ry="7" fill="#FFD699" />
      <ellipse cx="70" cy="35" rx="5" ry="7" fill="#FFD699" />
      
      {/* Olhinhos grandes */}
      <ellipse cx="40" cy="52" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="52" rx="8" ry="9" fill="white" />
      <circle cx="42" cy="53" r="5" fill="#333" />
      <circle cx="62" cy="53" r="5" fill="#333" />
      <circle cx="43" cy="51" r="2" fill="white" />
      <circle cx="63" cy="51" r="2" fill="white" />
      
      {/* Boquinha feliz */}
      <path d="M 43 65 Q 50 72 57 65" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Bochechas rosadas */}
      <circle cx="30" cy="60" r="5" fill="#FFB5B5" opacity="0.6" />
      <circle cx="70" cy="60" r="5" fill="#FFB5B5" opacity="0.6" />
      
      {/* Chama na cabeca */}
      <path d="M 50 25 Q 45 18 50 10 Q 55 18 50 25" fill="#FF6B35" />
      <path d="M 50 25 Q 47 20 50 15 Q 53 20 50 25" fill="#FFD93D" />
      
      <defs>
        <radialGradient id="bebeGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE4B5" />
          <stop offset="100%" stopColor="#FFB347" />
        </radialGradient>
      </defs>
    </svg>
  )

  const renderCrianca = () => (
    <svg viewBox="0 0 100 100" className={cn(sizeClasses[size], isAnimated && "animate-pulse", className)}>
      {/* Corpo mais alongado */}
      <ellipse cx="50" cy="58" rx="32" ry="30" fill="url(#criancaGradient)" />
      
      {/* Orelhinhas maiores */}
      <ellipse cx="25" cy="35" rx="10" ry="12" fill="#FF8C42" />
      <ellipse cx="75" cy="35" rx="10" ry="12" fill="#FF8C42" />
      <ellipse cx="25" cy="35" rx="6" ry="8" fill="#FFBB70" />
      <ellipse cx="75" cy="35" rx="6" ry="8" fill="#FFBB70" />
      
      {/* Olhinhos expressivos */}
      <ellipse cx="38" cy="52" rx="10" ry="11" fill="white" />
      <ellipse cx="62" cy="52" rx="10" ry="11" fill="white" />
      <circle cx="40" cy="53" r="6" fill="#333" />
      <circle cx="64" cy="53" r="6" fill="#333" />
      <circle cx="42" cy="51" r="2.5" fill="white" />
      <circle cx="66" cy="51" r="2.5" fill="white" />
      
      {/* Sorriso maior */}
      <path d="M 40 68 Q 50 78 60 68" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* Bochechas */}
      <circle cx="25" cy="62" r="6" fill="#FFB5B5" opacity="0.6" />
      <circle cx="75" cy="62" r="6" fill="#FFB5B5" opacity="0.6" />
      
      {/* Chama maior */}
      <path d="M 50 22 Q 42 12 50 0 Q 58 12 50 22" fill="#FF6B35" />
      <path d="M 50 22 Q 45 14 50 5 Q 55 14 50 22" fill="#FFD93D" />
      <path d="M 43 25 Q 38 20 43 15" stroke="#FF6B35" strokeWidth="3" fill="none" />
      <path d="M 57 25 Q 62 20 57 15" stroke="#FF6B35" strokeWidth="3" fill="none" />
      
      {/* Patinhas */}
      <ellipse cx="35" cy="85" rx="8" ry="5" fill="#FF8C42" />
      <ellipse cx="65" cy="85" rx="8" ry="5" fill="#FF8C42" />
      
      <defs>
        <radialGradient id="criancaGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFD699" />
          <stop offset="100%" stopColor="#FF8C42" />
        </radialGradient>
      </defs>
    </svg>
  )

  const renderAdolescente = () => (
    <svg viewBox="0 0 100 100" className={cn(sizeClasses[size], isAnimated && "animate-pulse", className)}>
      {/* Aura de fogo */}
      <ellipse cx="50" cy="55" rx="42" ry="40" fill="url(#auraGradient)" opacity="0.3" />
      
      {/* Corpo */}
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="url(#adolescenteGradient)" />
      
      {/* Orelhinhas com chamas */}
      <path d="M 20 40 Q 15 25 25 30 Q 20 35 20 40" fill="#FF6B35" />
      <path d="M 80 40 Q 85 25 75 30 Q 80 35 80 40" fill="#FF6B35" />
      <ellipse cx="22" cy="38" rx="8" ry="10" fill="#FF6B35" />
      <ellipse cx="78" cy="38" rx="8" ry="10" fill="#FF6B35" />
      <ellipse cx="22" cy="38" rx="5" ry="7" fill="#FF9F45" />
      <ellipse cx="78" cy="38" rx="5" ry="7" fill="#FF9F45" />
      
      {/* Olhos mais determinados */}
      <ellipse cx="38" cy="52" rx="11" ry="12" fill="white" />
      <ellipse cx="62" cy="52" rx="11" ry="12" fill="white" />
      <ellipse cx="40" cy="53" rx="7" ry="8" fill="#333" />
      <ellipse cx="64" cy="53" rx="7" ry="8" fill="#333" />
      <circle cx="42" cy="50" r="3" fill="white" />
      <circle cx="66" cy="50" r="3" fill="white" />
      {/* Sobrancelhas */}
      <path d="M 30 42 L 42 45" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      <path d="M 70 42 L 58 45" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      
      {/* Sorriso confiante */}
      <path d="M 38 68 Q 50 80 62 68" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Bochechas */}
      <circle cx="23" cy="62" r="7" fill="#FF6B6B" opacity="0.5" />
      <circle cx="77" cy="62" r="7" fill="#FF6B6B" opacity="0.5" />
      
      {/* Chama grande na cabeca */}
      <path d="M 50 18 Q 38 5 50 -10 Q 62 5 50 18" fill="#FF6B35" />
      <path d="M 50 18 Q 42 8 50 -5 Q 58 8 50 18" fill="#FFD93D" />
      <path d="M 40 22 Q 30 10 38 5" stroke="#FF6B35" strokeWidth="4" fill="none" />
      <path d="M 60 22 Q 70 10 62 5" stroke="#FF6B35" strokeWidth="4" fill="none" />
      
      {/* Patinhas */}
      <ellipse cx="32" cy="87" rx="10" ry="6" fill="#FF6B35" />
      <ellipse cx="68" cy="87" rx="10" ry="6" fill="#FF6B35" />
      
      <defs>
        <radialGradient id="adolescenteGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF9F45" />
          <stop offset="100%" stopColor="#FF6B35" />
        </radialGradient>
        <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )

  const renderAdulto = () => (
    <svg viewBox="0 0 100 100" className={cn(sizeClasses[size], isAnimated && "animate-pulse", className)}>
      {/* Aura poderosa */}
      <ellipse cx="50" cy="55" rx="48" ry="45" fill="url(#adultoAura)" opacity="0.4" />
      
      {/* Corpo majestoso */}
      <ellipse cx="50" cy="58" rx="36" ry="34" fill="url(#adultoGradient)" />
      
      {/* Chifres de fogo */}
      <path d="M 18 35 Q 10 15 20 20 Q 18 28 18 35" fill="#E63946" />
      <path d="M 82 35 Q 90 15 80 20 Q 82 28 82 35" fill="#E63946" />
      
      {/* Orelhinhas elegantes */}
      <ellipse cx="20" cy="40" rx="10" ry="12" fill="#E63946" />
      <ellipse cx="80" cy="40" rx="10" ry="12" fill="#E63946" />
      <ellipse cx="20" cy="40" rx="6" ry="8" fill="#FF6B6B" />
      <ellipse cx="80" cy="40" rx="6" ry="8" fill="#FF6B6B" />
      
      {/* Olhos poderosos */}
      <ellipse cx="37" cy="52" rx="12" ry="13" fill="white" />
      <ellipse cx="63" cy="52" rx="12" ry="13" fill="white" />
      <ellipse cx="39" cy="53" rx="8" ry="9" fill="#1a1a2e" />
      <ellipse cx="65" cy="53" rx="8" ry="9" fill="#1a1a2e" />
      <circle cx="41" cy="50" r="3.5" fill="white" />
      <circle cx="67" cy="50" r="3.5" fill="white" />
      {/* Brilho nos olhos */}
      <circle cx="37" cy="55" r="1.5" fill="#FFD93D" />
      <circle cx="63" cy="55" r="1.5" fill="#FFD93D" />
      
      {/* Sobrancelhas fortes */}
      <path d="M 28 40 L 44 44" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
      <path d="M 72 40 L 56 44" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
      
      {/* Sorriso majestoso */}
      <path d="M 36 70 Q 50 82 64 70" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Marca especial na testa */}
      <path d="M 50 35 L 47 42 L 53 42 Z" fill="#FFD93D" />
      
      {/* Chama majestosa */}
      <path d="M 50 15 Q 35 -5 50 -20 Q 65 -5 50 15" fill="#E63946" />
      <path d="M 50 15 Q 40 0 50 -15 Q 60 0 50 15" fill="#FF6B6B" />
      <path d="M 50 15 Q 45 5 50 -8 Q 55 5 50 15" fill="#FFD93D" />
      <path d="M 35 20 Q 22 5 32 -5" stroke="#E63946" strokeWidth="5" fill="none" />
      <path d="M 65 20 Q 78 5 68 -5" stroke="#E63946" strokeWidth="5" fill="none" />
      
      {/* Patinhas fortes */}
      <ellipse cx="30" cy="88" rx="12" ry="7" fill="#E63946" />
      <ellipse cx="70" cy="88" rx="12" ry="7" fill="#E63946" />
      
      {/* Particulas de fogo */}
      <circle cx="15" cy="50" r="2" fill="#FFD93D" opacity="0.8" />
      <circle cx="85" cy="50" r="2" fill="#FFD93D" opacity="0.8" />
      <circle cx="20" cy="70" r="1.5" fill="#FF6B6B" opacity="0.6" />
      <circle cx="80" cy="70" r="1.5" fill="#FF6B6B" opacity="0.6" />
      
      <defs>
        <radialGradient id="adultoGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#E63946" />
        </radialGradient>
        <radialGradient id="adultoAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  )

  const renderLendario = () => (
    <svg viewBox="0 0 100 100" className={cn(sizeClasses[size], isAnimated && "animate-pulse", className)}>
      {/* Aura lendaria multiplas camadas */}
      <ellipse cx="50" cy="55" rx="50" ry="48" fill="url(#lendarioAura1)" opacity="0.2" />
      <ellipse cx="50" cy="55" rx="45" ry="43" fill="url(#lendarioAura2)" opacity="0.3" />
      
      {/* Corpo divino */}
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="url(#lendarioGradient)" />
      {/* Brilho no corpo */}
      <ellipse cx="40" cy="50" rx="15" ry="20" fill="white" opacity="0.2" />
      
      {/* Coroa dourada */}
      <path d="M 30 25 L 35 15 L 42 22 L 50 10 L 58 22 L 65 15 L 70 25 L 65 28 L 35 28 Z" fill="url(#coroaGradient)" />
      <circle cx="50" cy="18" r="4" fill="#FFD93D" />
      <circle cx="38" cy="22" r="2.5" fill="#FF6B6B" />
      <circle cx="62" cy="22" r="2.5" fill="#6B5CE7" />
      
      {/* Asas de fogo */}
      <path d="M 10 55 Q 0 40 15 45 Q 5 55 15 60 Q 5 65 10 55" fill="url(#asaGradient)" opacity="0.8" />
      <path d="M 90 55 Q 100 40 85 45 Q 95 55 85 60 Q 95 65 90 55" fill="url(#asaGradient)" opacity="0.8" />
      
      {/* Orelhinhas magicas */}
      <ellipse cx="18" cy="42" rx="12" ry="14" fill="url(#orelhaLendaria)" />
      <ellipse cx="82" cy="42" rx="12" ry="14" fill="url(#orelhaLendaria)" />
      <ellipse cx="18" cy="42" rx="7" ry="9" fill="#FFB5E8" />
      <ellipse cx="82" cy="42" rx="7" ry="9" fill="#FFB5E8" />
      
      {/* Olhos magicos */}
      <ellipse cx="36" cy="54" rx="13" ry="14" fill="white" />
      <ellipse cx="64" cy="54" rx="13" ry="14" fill="white" />
      {/* Iris com gradiente */}
      <ellipse cx="38" cy="55" rx="9" ry="10" fill="url(#irisGradient)" />
      <ellipse cx="66" cy="55" rx="9" ry="10" fill="url(#irisGradient)" />
      {/* Pupila */}
      <ellipse cx="39" cy="55" rx="5" ry="6" fill="#1a1a2e" />
      <ellipse cx="67" cy="55" rx="5" ry="6" fill="#1a1a2e" />
      {/* Brilhos */}
      <circle cx="41" cy="52" r="4" fill="white" />
      <circle cx="69" cy="52" r="4" fill="white" />
      <circle cx="36" cy="58" r="2" fill="#FFD93D" />
      <circle cx="64" cy="58" r="2" fill="#FFD93D" />
      
      {/* Sobrancelhas elegantes */}
      <path d="M 25 42 Q 35 38 46 46" stroke="#6B5CE7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 75 42 Q 65 38 54 46" stroke="#6B5CE7" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Sorriso divino */}
      <path d="M 34 72 Q 50 85 66 72" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Marca divina na testa */}
      <circle cx="50" cy="38" r="5" fill="url(#marcaGradient)" />
      <circle cx="50" cy="38" r="3" fill="#FFD93D" />
      
      {/* Bochechas brilhantes */}
      <circle cx="22" cy="65" r="8" fill="#FFB5E8" opacity="0.6" />
      <circle cx="78" cy="65" r="8" fill="#FFB5E8" opacity="0.6" />
      
      {/* Chama divina */}
      <path d="M 50 5 Q 30 -20 50 -35 Q 70 -20 50 5" fill="url(#chamaLendaria1)" />
      <path d="M 50 5 Q 35 -15 50 -30 Q 65 -15 50 5" fill="url(#chamaLendaria2)" />
      <path d="M 50 5 Q 42 -8 50 -20 Q 58 -8 50 5" fill="#FFD93D" />
      <path d="M 30 12 Q 15 -5 28 -15" stroke="url(#chamaLendaria1)" strokeWidth="6" fill="none" />
      <path d="M 70 12 Q 85 -5 72 -15" stroke="url(#chamaLendaria1)" strokeWidth="6" fill="none" />
      
      {/* Patinhas magicas */}
      <ellipse cx="28" cy="90" rx="14" ry="8" fill="url(#orelhaLendaria)" />
      <ellipse cx="72" cy="90" rx="14" ry="8" fill="url(#orelhaLendaria)" />
      
      {/* Particulas magicas */}
      <circle cx="10" cy="45" r="3" fill="#FFD93D" opacity="0.9" />
      <circle cx="90" cy="45" r="3" fill="#FFD93D" opacity="0.9" />
      <circle cx="5" cy="60" r="2" fill="#6B5CE7" opacity="0.7" />
      <circle cx="95" cy="60" r="2" fill="#6B5CE7" opacity="0.7" />
      <circle cx="15" cy="75" r="2.5" fill="#FF6B6B" opacity="0.8" />
      <circle cx="85" cy="75" r="2.5" fill="#FF6B6B" opacity="0.8" />
      <circle cx="25" cy="20" r="2" fill="#FFB5E8" opacity="0.8" />
      <circle cx="75" cy="20" r="2" fill="#FFB5E8" opacity="0.8" />
      
      <defs>
        <radialGradient id="lendarioGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFB5E8" />
          <stop offset="50%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#6B5CE7" />
        </radialGradient>
        <radialGradient id="lendarioAura1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="lendarioAura2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B5CE7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="coroaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="50%" stopColor="#FFF176" />
          <stop offset="100%" stopColor="#FFD93D" />
        </linearGradient>
        <linearGradient id="orelhaLendaria" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#6B5CE7" />
        </linearGradient>
        <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="50%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#6B5CE7" />
        </radialGradient>
        <radialGradient id="marcaGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="100%" stopColor="#6B5CE7" />
        </radialGradient>
        <linearGradient id="chamaLendaria1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#6B5CE7" />
          <stop offset="50%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FFD93D" />
        </linearGradient>
        <linearGradient id="chamaLendaria2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FFD93D" />
        </linearGradient>
        <linearGradient id="asaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="50%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#6B5CE7" />
        </linearGradient>
      </defs>
    </svg>
  )

  const renderPet = () => {
    switch (stage) {
      case "bebe":
        return renderBebe()
      case "crianca":
        return renderCrianca()
      case "adolescente":
        return renderAdolescente()
      case "adulto":
        return renderAdulto()
      case "lendario":
        return renderLendario()
      default:
        return renderBebe()
    }
  }

  return <div className="flex items-center justify-center">{renderPet()}</div>
}
