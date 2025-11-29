import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Users as UsersIcon,
  Shield,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { UserService, type UserData, type CreateUserData, type UpdateUserData } from '../services/user.service';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'mahasiswa' as 'admin' | 'dosen' | 'mahasiswa',
    nim: '',
    nip: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.full_name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.full_name || !formData.password) {
      setError('Nama lengkap dan password harus diisi');
      return;
    }

    if (formData.role === 'mahasiswa' && !formData.nim) {
      setError('NIM harus diisi untuk mahasiswa');
      return;
    }

    if ((formData.role === 'dosen' || formData.role === 'admin') && !formData.nip) {
      setError('NIP harus diisi untuk dosen/admin');
      return;
    }

    setSubmitting(true);
    setError(null);

    const username = formData.role === 'mahasiswa' ? formData.nim : formData.nip;

    const userData: CreateUserData = {
      username: username,
      password: formData.password,
      full_name: formData.full_name,
      role: formData.role,
      nim: formData.role === 'mahasiswa' ? formData.nim : undefined,
      nip: formData.role === 'mahasiswa' ? undefined : formData.nip,
    };

    const result = await UserService.createUser(userData);

    if (result.success) {
      setShowCreateDialog(false);
      resetForm();
      loadUsers();
    } else {
      setError(result.error || 'Gagal membuat user');
    }

    setSubmitting(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (!formData.full_name) {
      setError('Nama lengkap harus diisi');
      return;
    }

    if (formData.role === 'mahasiswa' && !formData.nim) {
      setError('NIM harus diisi untuk mahasiswa');
      return;
    }

    if ((formData.role === 'dosen' || formData.role === 'admin') && !formData.nip) {
      setError('NIP harus diisi untuk dosen/admin');
      return;
    }

    setSubmitting(true);
    setError(null);

    const username = formData.role === 'mahasiswa' ? formData.nim : formData.nip;

    const userData: UpdateUserData = {
      username: username,
      full_name: formData.full_name,
      role: formData.role,
      nim: formData.role === 'mahasiswa' ? formData.nim : undefined,
      nip: formData.role === 'mahasiswa' ? undefined : formData.nip,
    };

    if (formData.password) {
      userData.password = formData.password;
    }

    const result = await UserService.updateUser(selectedUser.id, userData);

    if (result.success) {
      setShowEditDialog(false);
      resetForm();
      setSelectedUser(null);
      loadUsers();
    } else {
      setError(result.error || 'Gagal mengupdate user');
    }

    setSubmitting(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError(null);

    const result = await UserService.deleteUser(selectedUser.id);

    if (result.success) {
      setShowDeleteDialog(false);
      setSelectedUser(null);
      loadUsers();
    } else {
      setError(result.error || 'Gagal menghapus user');
    }

    setSubmitting(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '',
      full_name: user.full_name,
      role: user.role,
      nim: user.nim || '',
      nip: user.nip || '',
    });
    setError(null);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setError(null);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      full_name: '',
      role: 'mahasiswa',
      nim: '',
      nip: '',
    });
    setError(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'dosen':
        return <BookOpen className="w-4 h-4" />;
      case 'mahasiswa':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <UsersIcon className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-700',
      dosen: 'bg-blue-100 text-blue-700',
      mahasiswa: 'bg-green-100 text-green-700',
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[role as keyof typeof colors] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const roleStats = {
    admin: users.filter((u) => u.role === 'admin').length,
    dosen: users.filter((u) => u.role === 'dosen').length,
    mahasiswa: users.filter((u) => u.role === 'mahasiswa').length,
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manajemen User</h1>
            <p className="text-slate-600 mt-1">
              Kelola akun pengguna sistem rekam medis
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Tambah User Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total User</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {users.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Admin</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {roleStats.admin}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Dosen</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {roleStats.dosen}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Mahasiswa</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {roleStats.mahasiswa}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Daftar User ({filteredUsers.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cari nama, username, atau role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-slate-700">
                        Nama Lengkap
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-slate-700">
                        NIM / NIP
                      </th>
                      <th className="text-center p-3 text-sm font-semibold text-slate-700">
                        Role
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-slate-700">
                        Dibuat
                      </th>
                      <th className="text-center p-3 text-sm font-semibold text-slate-700">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-3 text-sm font-medium text-slate-900">
                          {user.full_name}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {user.role === 'mahasiswa' ? user.nim || '-' : user.nip || '-'}
                        </td>
                        <td className="p-3 text-center">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <UsersIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-lg font-medium">
                  {searchQuery ? 'User tidak ditemukan' : 'Belum ada data user'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
            <DialogDescription>
              Buat akun pengguna baru untuk sistem rekam medis
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="create-role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'dosen' | 'mahasiswa') =>
                  setFormData({ ...formData, role: value, nim: '', nip: '' })
                }
              >
                <SelectTrigger id="create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="dosen">Dosen</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'mahasiswa' ? (
              <div className="space-y-2">
                <Label htmlFor="create-nim">NIM *</Label>
                <Input
                  id="create-nim"
                  placeholder="Contoh: 12345678"
                  value={formData.nim}
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">NIM akan digunakan sebagai username</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="create-nip">NIP *</Label>
                <Input
                  id="create-nip"
                  placeholder="Contoh: 198001012000011001"
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">NIP akan digunakan sebagai username</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="create-fullname">Nama Lengkap *</Label>
              <Input
                id="create-fullname"
                placeholder="Dr. Nama Lengkap"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleCreateUser} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Ubah informasi user {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'dosen' | 'mahasiswa') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                  <SelectItem value="dosen">Dosen</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'mahasiswa' ? (
              <div className="space-y-2">
                <Label htmlFor="edit-nim">NIM *</Label>
                <Input
                  id="edit-nim"
                  placeholder="Contoh: 12345678"
                  value={formData.nim}
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">NIM akan digunakan sebagai username</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-nip">NIP *</Label>
                <Input
                  id="edit-nip"
                  placeholder="Contoh: 198001012000011001"
                  value={formData.nip}
                  onChange={(e) =>
                    setFormData({ ...formData, nip: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">NIP akan digunakan sebagai username</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-fullname">Nama Lengkap *</Label>
              <Input
                id="edit-fullname"
                placeholder="Dr. Nama Lengkap"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password Baru</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateUser} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus user ini?
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 mb-4">
                {error}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  {selectedUser?.full_name}
                </p>
                <p className="text-sm text-slate-600">
                  Username: {selectedUser?.username}
                </p>
                <p className="text-sm text-slate-600">
                  Role: {selectedUser?.role}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-4">
              User yang dihapus tidak dapat dikembalikan. Pastikan user ini tidak
              memiliki data rekam medis terkait.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};
