
export interface Icon {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any; // Permitir cualquier otra propiedad
}
export type User ={
    name: string;
    surname: string;
    phone: string;
    photo: string;
    aboutMe: string;
    links:{
      Github:string;
      Linkedin:string;
      Gmail:string;
    };
    skills: Skill[];
    projects: Project[];
    testimonies: Testimonies[];
}
export type UserLinks = {
  userLinks: User["links"];
};
export type UserProps={
  userData: User;
}
interface Project {
  projectName: string;
  enterpriseicono: string;
  projectImage: string;
  date: string;
  description: string;
  technologies: string[];
  link: string;
}
export interface Skill {
  icono: JSX.Element;
  level: number;
  color: string;
}
export type ContactInfo = {
  Github: string,
  Linkedin: string,
  Gmail:string;
};
export type ContactInfoProps = {
  contactInfo: ContactInfo;
};
export interface RootLayoutProps extends React.PropsWithChildren<{}> {
  userData?: User; // Assuming User is correctly defined
}
type Testimonies = {
  author: string;
  photo: string;
  testimonial: string;
  projectLink: string;
};
export interface CustomSvgIconProps {
  svgContent: JSX.Element; 
  className:  string;
}
export interface IconSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number; 
  width?: number; 
  height?: number; 
}
export interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
 
}
export type ProjectsCardProps ={ 
  projects: Project[];
 }