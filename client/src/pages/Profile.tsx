import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await authApi.updateProfile(name);
      setUser(updatedUser);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update profile';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className='container py-8'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>Profile</h1>

          <div className='bg-card rounded-lg shadow-sm p-6'>
            <div className='flex items-center gap-6 mb-8'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='text-2xl'>
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className='text-2xl font-semibold'>{user.name}</h2>
                <p className='text-muted-foreground'>{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || isLoading}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' value={user.email} disabled />
              </div>

              <div className='flex gap-4'>
                {isEditing ? (
                  <>
                    <Button type='submit' disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setName(user.name);
                        setIsEditing(false);
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button type='button' onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
