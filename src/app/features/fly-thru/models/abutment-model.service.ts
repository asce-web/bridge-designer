import { Injectable } from '@angular/core';
import { DesignConditions } from '../../../shared/services/design-conditions.service';

/** A container for the singleton abutment model. */
@Injectable({ providedIn: 'root' })
export class AbutmentModelService {
  /*
    private static readonly halfTerrainSize = 192f;
    private static readonly halfGapWidth = 24.0f;
    private static readonly bankSlope = 2.0f;
    private static readonly waterLevel = -26.0f;
    private static readonly blufSetback = halfGapWidth * .2f;
    private static readonly accessSlope = (float)BridgeView.accessSlope;
    private static readonly tangentOffset = (float)BridgeView.tangentOffset;
    private static readonly wearSurfaceHeight = (float)BridgeView.wearSurfaceHeight;
    private static readonly abutmentStepInset = (float)BridgeView.abutmentStepInset;
    private static readonly abutmentStepHeight = (float)BridgeView.abutmentStepHeight;
    private static readonly abutmentStepWidth = (float)BridgeView.abutmentStepWidth;
    private static readonly anchorOffset = (float)DesignConditions.anchorOffset;
    private static readonly deckHalfWidth = (float)Animation.deckHalfWidth;
    private static readonly stoneTextureSize = .3f;
    private static readonly tBlufAtBridge = halfGapWidth + blufSetback;
    private static readonly tInflection = halfGapWidth - blufSetback;
    private static readonly blufCoeff = -0.5f * bankSlope / (tInflection -  (blufSetback + halfGapWidth));
    private static readonly yGorgeBottom = -halfGapWidth * bankSlope;
    private static readonly tWaterEdge = (waterLevel - yGorgeBottom) / bankSlope;
    private static readonly roadCutSlope = 1f;
    private static readonly epsPaint = 0.05f;
 */

  constructor(private readonly designConditions: DesignConditions) {}
  
  buildAbutmentForDesignConditions() {
    const positions = [];
    const normals = [];
    normals.push(
      1, 0, 0,
      0, 1, 0,
      1, 0, 0,
    );
  }

  /* 
        gl.glColor3fv(abutmentMaterial, 0);
        gl.glActiveTexture(GL2.GL_TEXTURE0);
        pierTexture.enable(gl);
        pierTexture.bind(gl);
        
        gl.glBegin(GL2.GL_TRIANGLE_FAN);
        gl.glNormal3f(0f, 0f, 1f);
        int i2 = 0;
        for (int i3 = 0; i3 < abutmentFrontFlank.length; i3 += 3, i2 += 2) {
            gl.glTexCoord2fv(abutmentFrontFlankTexture, i2);
            gl.glVertex3fv(abutmentFrontFlank, i3);
        }
        gl.glEnd();

        gl.glBegin(GL2.GL_TRIANGLE_FAN);
        gl.glNormal3f(0f, 0f, -1f);
        i2 = 0;
        for (int i3 = 0; i3 < abutmentRearFlank.length; i3 += 3, i2 += 2) {
            gl.glTexCoord2fv(abutmentRearFlankTexture, i2);
            gl.glVertex3fv(abutmentRearFlank, i3);            
        }
        gl.glEnd();
        
        gl.glBegin(GL2.GL_QUADS);
        i2 = 0;
        for (int i3 = 0; i3 < abutmentFaceNormals.length; i3 += 3, i2 += 2) {
            gl.glNormal3fv(abutmentFaceNormals, i3);
            
            gl.glTexCoord2fv(abutmentRearFaceTexture, i2);
            gl.glVertex3fv(abutmentRearFace, i3);
            
            gl.glTexCoord2fv(abutmentFrontFaceTexture, i2);
            gl.glVertex3fv(abutmentFrontFace, i3);
            
            gl.glTexCoord2fv(abutmentFrontFaceTexture, i2 + 2);
            gl.glVertex3fv(abutmentFrontFace, i3 + 3);
            
            gl.glTexCoord2fv(abutmentRearFaceTexture, i2 + 2);
            gl.glVertex3fv(abutmentRearFace, i3 + 3);
        }
        gl.glEnd();
        pierTexture.disable(gl);
        
        // Top shoulder.
        gl.glColor3fv(flatTerrainMaterial, 0);
        gl.glBegin(GL2.GL_QUAD_STRIP);
        gl.glNormal3f(0f, 1f, 0f);
        for (int i = 0; i < abutmentFrontTop.length; i += 3) {
            gl.glVertex3fv(abutmentRearTop, i);
            gl.glVertex3fv(abutmentFrontTop, i);
        }
        gl.glEnd();
        
        // Pillow
        gl.glColor3fv(pillowMaterial, 0);
        gl.glBegin(GL2.GL_TRIANGLES);
        gl.glNormal3f(0f, 0f, 1f);
        for (int i = pillowFrontFace.length - 3; i >= 0; i -= 3) {
            gl.glVertex3fv(pillowFrontFace, i);
        }
        gl.glNormal3f(0f, 0f, -1f);
        for (int i = 0; i < pillowRearFace.length; i += 3) {
            gl.glVertex3fv(pillowRearFace, i);
        }
        gl.glEnd();
        gl.glBegin(GL2.GL_QUADS);
        int j = 0;
        for (int i = 3; i < pillowFrontFace.length; j = i, i += 3) {
            final float dx = pillowFrontFace[i + 0] - pillowFrontFace[j + 0];
            final float dy = pillowFrontFace[i + 1] - pillowFrontFace[j + 1];
            gl.glNormal3f(-dy, dx, 0f);
            gl.glVertex3fv(pillowRearFace, j);
            gl.glVertex3fv(pillowFrontFace, j);
            gl.glVertex3fv(pillowFrontFace, i);
            gl.glVertex3fv(pillowRearFace, i);
        }
        gl.glEnd();        
  */
}
