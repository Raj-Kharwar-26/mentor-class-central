
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Video, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentUploadProps {
  courseId: string;
  onContentUploaded: () => void;
}

const ContentUpload: React.FC<ContentUploadProps> = ({ courseId, onContentUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoFile: null as File | null,
    thumbnail: null as File | null
  });
  const [pdfForm, setPdfForm] = useState({
    title: '',
    description: '',
    pdfFile: null as File | null
  });
  const { toast } = useToast();

  const handleVideoUpload = async () => {
    if (!videoForm.title || !videoForm.videoFile) {
      toast({
        title: 'Validation Error',
        description: 'Please provide title and video file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // In a real implementation, this would upload to cloud storage
      // For now, we'll simulate the upload
      console.log('Uploading video:', videoForm);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Video Uploaded',
        description: 'Your video has been uploaded successfully.',
      });
      
      setVideoForm({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null
      });
      
      onContentUploaded();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfUpload = async () => {
    if (!pdfForm.title || !pdfForm.pdfFile) {
      toast({
        title: 'Validation Error',
        description: 'Please provide title and PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Uploading PDF:', pdfForm);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'PDF Uploaded',
        description: 'Your PDF has been uploaded successfully.',
      });
      
      setPdfForm({
        title: '',
        description: '',
        pdfFile: null
      });
      
      onContentUploaded();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="space-y-4">
            <div>
              <Label htmlFor="video-title">Video Title</Label>
              <Input
                id="video-title"
                value={videoForm.title}
                onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Advanced Calculus - Lesson 1"
              />
            </div>
            
            <div>
              <Label htmlFor="video-description">Description</Label>
              <Textarea
                id="video-description"
                value={videoForm.description}
                onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the video content..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="video-file">Video File</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoForm(prev => ({ ...prev, videoFile: e.target.files?.[0] || null }))}
              />
              {videoForm.videoFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {videoForm.videoFile.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="video-thumbnail">Thumbnail (Optional)</Label>
              <Input
                id="video-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnail: e.target.files?.[0] || null }))}
              />
            </div>
            
            <Button 
              onClick={handleVideoUpload} 
              disabled={isUploading || !videoForm.title || !videoForm.videoFile}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </TabsContent>
          
          <TabsContent value="pdf" className="space-y-4">
            <div>
              <Label htmlFor="pdf-title">PDF Title</Label>
              <Input
                id="pdf-title"
                value={pdfForm.title}
                onChange={(e) => setPdfForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Formula Sheet - Differentiation"
              />
            </div>
            
            <div>
              <Label htmlFor="pdf-description">Description</Label>
              <Textarea
                id="pdf-description"
                value={pdfForm.description}
                onChange={(e) => setPdfForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the PDF content..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="pdf-file">PDF File</Label>
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfForm(prev => ({ ...prev, pdfFile: e.target.files?.[0] || null }))}
              />
              {pdfForm.pdfFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {pdfForm.pdfFile.name}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handlePdfUpload} 
              disabled={isUploading || !pdfForm.title || !pdfForm.pdfFile}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload PDF'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentUpload;
