import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Mail, MapPin, Car, Globe, Briefcase, GraduationCap, Award, Trophy } from "lucide-react";
import { SiPython, SiAdobepremierepro, SiHtml5, SiCss3, SiLua } from "react-icons/si";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const badgeVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const profilePhotoVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

interface SkillBadgeProps {
  icon: React.ComponentType;
  label: string;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({
  icon: Icon,
  label,
  className = "",
}) => (
  <motion.div
    variants={badgeVariants}
    initial="initial"
    whileHover="hover"
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer ${className}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </motion.div>
);

export default function CV() {
  return (
    <div className="space-y-8">
      {/* Section Présentation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }}
          className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors bg-background/50 shadow-lg hover:shadow-xl overflow-hidden"
        >
          <div className="grid md:grid-cols-[300px,1fr] gap-8 p-8">
            {/* Colonne gauche : Photo et titre */}
            <div className="space-y-6">
              {/* Photo de profil */}
              <motion.div
                variants={profilePhotoVariants}
                initial="initial"
                whileHover="hover"
                className="flex justify-center"
              >
                <Avatar className="w-48 h-48 ring-4 ring-primary/10">
                  <AvatarImage src="Photo_PS.png" alt="Ma photo" className="object-cover" />
                  <AvatarFallback>IB</AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Nom et titre */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Imad Bouzalmata</h2>
                <p className="text-primary font-medium">Développeur junior</p>
              </div>
            </div>

            {/* Colonne droite : Présentation et informations de contact */}
            <div className="space-y-6">
              <motion.h1
                className="text-4xl font-bold text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                Présentation
              </motion.h1>

              <div className="space-y-4">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Je suis animé par une passion pour des domaines comme la cybersécurité, l’intelligence artificielle et la blockchain. Ces intérêts m’ont permis de concrétiser divers projets, tels que des serveurs de jeu en ligne et des sites web, tout en développant ma créativité et mes compétences techniques.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Mon parcours reflète un équilibre entre ma passion pour les technologies numériques et mon engagement citoyen. Fort de mon expérience en tant que sportif de haut niveau et pompier volontaire, j’ai appris à travailler en équipe et à relever des défis ambitieux avec persévérance.
                </p>
              </div>

              {/* Informations de contact */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-border/50">
                <InfoItem
                  icon={<MapPin className="w-4 h-4 text-primary" />}
                  text="Corbeil-Essonnes, France"
                />
                <InfoItem
                  icon={<Mail className="w-4 h-4 text-primary" />}
                  text={
                    <a
                      href="mailto:imad.bouzalmata@protonmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      imad.bouzalmata@protonmail.com
                    </a>
                  }
                />
                <InfoItem
                  icon={<Car className="w-4 h-4 text-primary" />}
                  text="Permis de conduire B"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>



      {/* Compétences principales avec badges */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants} initial="initial" whileHover="hover" style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }} className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors p-6 bg-background shadow-lg hover:shadow-xl transform-gpu">
          <CardContent className="flex flex-col md:flex-row gap-6 pt-6">
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
              <img 
                src="/Photo_PS.png" 
                alt="Photo de profil" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <motion.h2
                className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Award className="w-5 h-5 text-primary" /> Compétences clés
              </motion.h2>
              <div className="grid gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    <SkillBadge icon={SiPython} label="Python" />
                    <SkillBadge icon={SiAdobepremierepro} label="Première Pro" />
                    <SkillBadge icon={SiHtml5} label="HTML" />
                    <SkillBadge icon={SiCss3} label="CSS" />
                    <SkillBadge icon={SiLua} label="Lua" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Gestion de Projet</h3>
                    <p className="text-sm text-muted-foreground">
                      Coordination d'équipes pluridisciplinaires
                      <br />
                      Planification et suivi budgétaire
                      <br />
                      Optimisation des processus
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Numérique</h3>
                    <p className="text-sm text-muted-foreground">
                      Montage vidéo avec Adobe Premiere Pro et After Effects
                      <br />
                      Création, hébergement, sécurisation et maintenance de serveurs
                      <br />
                      Intégration et optimisation de solutions web
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>

      {/* Expérience professionnelle */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants} initial="initial" whileHover="hover" style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }} className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors p-6 bg-background shadow-lg hover:shadow-xl transform-gpu">
          <CardContent className="pt-6">
            <motion.h2
              className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Briefcase className="w-5 h-5 text-primary" /> Expérience professionnelle
            </motion.h2>
            <Timeline
              items={[
                {
                  title: "Pompier industriel",
                  company: "Fiducial SH, Corbeil-Essonnes",
                  date: "fév. 2023 - présent",
                  description:
                    "Gestion d'urgences et prise de décisions rapides sous pression. Utilisation d'outils technologiques pour le suivi des interventions et la coordination d'équipe.",
                },
                {
                  title: "Conducteur de travaux BTP",
                  company: "Eiffage, Villejuif",
                  date: "sept. 2022 - sept. 2023",
                  description:
                    "Supervision de projets de construction, gestion budgétaire et coordination d'équipes pluridisciplinaires. Optimisation des processus et respect des délais.",
                },
                {
                  title: "Apprenti expert métallurgiste",
                  company: "GRTgaz, Compiègne",
                  date: "août 2020 - sept. 2022",
                  description:
                    "Analyse technique et contrôle non destructif (CND) en métallurgie. Diagnostics techniques et évaluation de l'intégrité des matériaux selon les normes de sécurité.",
                },
              ]}
            />
          </CardContent>
        </motion.div>
      </motion.div>

      {/* Formation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants} initial="initial" whileHover="hover" style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }} className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors p-6 bg-background shadow-lg hover:shadow-xl transform-gpu">
          <CardContent className="pt-6">
            <motion.h2
              className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GraduationCap className="w-5 h-5 text-primary" /> Formation
            </motion.h2>
            <Timeline
              items={[
                {
                  title: "DUT Science et Génie des Matériaux",
                  company: "Université Sorbonne Paris-Nord",
                  date: "2020 - 2022",
                },
                {
                  title: "Bac STI2D, mention Très Bien",
                  company: "Lycée Robert Doisneau, Corbeil-Essonnes",
                  date: "2018 - 2020",
                },
              ]}
            />
          </CardContent>
        </motion.div>
      </motion.div>

      {/* Langues */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants} initial="initial" whileHover="hover" style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }} className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors p-6 bg-background shadow-lg hover:shadow-xl transform-gpu">
          <CardContent className="pt-6">
            <motion.h2
              className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="w-5 h-5 text-primary" /> Langues
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Language name="Français" level="Langue maternelle" />
              <Language name="Anglais" level="Avancé" />
              <Language name="Espagnol" level="Intermédiaire" />
            </div>
          </CardContent>
        </motion.div>
      </motion.div>

      {/* Réalisations sportives et Engagement */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <motion.div variants={cardVariants} initial="initial" whileHover="hover" style={{
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
            textRendering: "optimizeLegibility"
          }} className="border-2 border-border/50 rounded-lg hover:border-primary/30 transition-colors p-6 bg-background shadow-lg hover:shadow-xl transform-gpu">
          <CardContent className="pt-6">
            <motion.h2
              className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Trophy className="w-5 h-5 text-primary" /> Réalisations sportives et Engagement
            </motion.h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <Achievement title="Kayak-polo de Haut Niveau">
                <li>🥈 Vice-Champion de France 2024</li>
                <li>🌍 10ᵉ place aux Championnats d'Europe 2024 (Bacoli - Italie)</li>
                <li>🥇 Champion de France 2023</li>
                <li>🥈 Vice-Champion de France 2022</li>
                <li>🥇 Vainqueur du tournoi de Zurich 2022</li>
                <li>🛶 Équipe de France U21 (2022)</li>
              </Achievement>
              <Achievement title="Engagement Citoyen">
                <p>🚒 Sapeur-pompier volontaire actif</p>
                <p>Expérience dans la lutte contre les incendies, les secours à personnes, ainsi que la sécurisation des biens et des environnements à risques. Capacité à intervenir efficacement en équipe sous pression et à assurer des prises de décisions rapides dans des contextes imprévisibles.</p>
                <p>Certifications : SST, PSE1/PSE2, INC1</p>
              </Achievement>
              <Achievement title="Création d'un monde virtuel interactif">
                <p>Développement intégral d'un serveur de jeu Garry's Mod, sécurisé, hébergé, maintenu à jour et optimisé pour offrir une expérience agréable aux joueurs. Les propositions de la communauté ont été prises en compte pour l'améliorer.</p>
              </Achievement>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InfoItem({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
      {icon}
      {text}
    </div>
  );
}

function Achievement({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-foreground">{title}</h3>
      <ul className="space-y-1 text-muted-foreground">{children}</ul>
    </div>
  );
}

function Timeline({
  items,
}: {
  items: { title: string; company: string; date: string; description?: string }[];
}) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative pl-6 border-l-2 border-primary/20 hover:border-primary transition-colors"
        >
          <h3 className="font-medium text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.company}</p>
          <p className="text-sm text-primary">{item.date}</p>
          {item.description && <p className="mt-2 text-muted-foreground">{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

function Language({ name, level }: { name: string; level: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground">{level}</p>
    </div>
  );
}