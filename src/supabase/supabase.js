import { createClient } from '@supabase/supabase-js'

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'https://ueyngrqihhjhegnjckmc.supabase.co'; // URL de tu proyecto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleW5ncnFpaGhqaGVnbmpja21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTMzMDYsImV4cCI6MjA0NzgyOTMwNn0.9GD5LHCnqLINmNAHagwiUWP9dCx3V8KCtJ0DXSLHgdQ'; // Tu clave pública de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Reemplaza con tus credenciales de Supabase
const supabase2Url = 'https://yavmmbxesjyhipjijpyk.supabase.co'; // URL de tu proyecto
const supabase2Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhdm1tYnhlc2p5aGlwamlqcHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMzYwNDIsImV4cCI6MjA0MDYxMjA0Mn0.fMkCFWraqpST81cVrHPfIVhvpLYKN2QCLIMlTA3mjjo'; // Tu clave pública de Supabase
export const supabase2 = createClient(supabase2Url, supabase2Key);
