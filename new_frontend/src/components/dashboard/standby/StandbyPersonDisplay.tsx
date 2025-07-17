
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail } from "lucide-react";
import { StandbyPerson } from "@/types/standby";

interface StandbyPersonDisplayProps {
  person: StandbyPerson | undefined;
  borderColor: string;
  bgColor: string;
  compact?: boolean;
}

export function StandbyPersonDisplay({ person, borderColor, bgColor, compact = false }: StandbyPersonDisplayProps) {
  if (!person) {
    return <div className="text-muted-foreground">Aucune garde programmée</div>;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className={`h-8 w-8 border-2 ${borderColor}`}>
          <AvatarImage src={person.avatar} alt={person.name} />
          <AvatarFallback className={bgColor}>
            {person.initials}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{person.name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`h-12 w-12 border-2 ${borderColor}`}>
        <AvatarImage src={person.avatar} alt={person.name} />
        <AvatarFallback className={bgColor}>
          {person.initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{person.name}</div>
        <div className="text-sm flex items-center gap-1 text-muted-foreground">
          <Phone className="h-3 w-3" />
          {person.phone}
        </div>
        <div className="text-sm flex items-center gap-1 text-muted-foreground">
          <Mail className="h-3 w-3" />
          {person.email}
        </div>
      </div>
    </div>
  );
}
